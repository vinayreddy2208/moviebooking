
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multer = require('multer');
const photosMiddleware = multer({ dest: 'uploads/' });
const imageDownloader = require('image-downloader');

const nodemailer = require('nodemailer');

const User = require('./models/User');
const Admin = require('./models/Admin');
const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const ShowInstance = require('./models/ShowInstance');
const Booking = require('./models/Booking');
const PriorityNotify = require('./models/PriorityNotify');
const GeneralNotify = require('./models/GeneralNotify');
const path = require('path');
const { type } = require('os');
const { from } = require('form-data');

const app = express();
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com', // Replace with your SMTP server
    port: 587,                // Port number (587 for TLS)
    secure: false,            // true for 465, false for other ports
    auth: {
        user: 'satwik058@gmail.com', // Your email address
        pass: process.env.EMAIL_PASS     // Your email password or app password
    }
});

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "ajdcub3r2qnhk3j14bhrnbasdhjb2";

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const allowedOrigins = [process.env.CLIENT_BASE_URL, process.env.ADMIN_BASE_URL];

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (allowedOrigins.indexOf(origin) != -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

mongoose.connect(process.env.MONGO_URL);

function getUserDataFromToken(req) {
    return new Promise((resolve, reject) => {
        jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
            if (err) throw err;
            resolve(userData);
        })
    });
}

app.get('/', (req, res) => {
    res.json('WASSUP YO')
})

// ! User Registration

app.post('/register', async (req, res) => {
    const { name, email, password, dob } = req.body;

    try {
        const userDoc = await User.create({
            name,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
            dob
        });
        res.json('Successfully created.')
    }
    catch (e) {
        res.status(422).json(e)
    }
});

// ! Admin Registration

app.post('/admin/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const AdminDoc = await Admin.create({
            username,
            password: bcrypt.hashSync(password, bcryptSalt),
            authority: 1,
        });
        res.json('Successfully created.')
    }
    catch (e) {
        res.status(422).json(e)
    }
});

// ! User Login

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userDoc = await User.findOne({ email });

    if (userDoc) {
        const passOK = bcrypt.compareSync(password, userDoc.password)
        if (passOK) {
            jwt.sign({ name: userDoc.name, email: userDoc.email, id: userDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;

                res.cookie('token', token).json({ name: userDoc.name, email: userDoc.email, uid: userDoc._id })

                // res.cookie('token', token).json({ name: userDoc.name, email: userDoc.email, uid: userDoc._id });
            })
        } else {
            res.json('Wrong Password');
        }
    } else {
        res.json('Account Not Found');
    }
})

// ! Admin Login

app.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    const AdminDoc = await Admin.findOne({ username });

    if (AdminDoc) {
        const passOK = bcrypt.compareSync(password, AdminDoc.password)
        if (passOK) {
            jwt.sign({ username: AdminDoc.username, id: AdminDoc._id }, jwtSecret, {}, (err, token) => {
                if (err) throw err;

                res.cookie('admin', token).json({ username: AdminDoc.username })

            })
        } else {
            res.status(422).json('Wrong Password');
        }
    } else {
        res.json('Admin Not Found');
    }
})

// ! Retrieving user info

app.get('/profile', async (req, res) => {
    const { token } = req.cookies;

    if (token) {
        jwt.verify(token, jwtSecret, {}, async (err, user) => {
            if (err) throw err;
            const userData = await User.findById(user.id)
            const { _id, name, email } = await User.findById(user.id)
            res.json({ _id, name, email });
        });
    } else {
        res.json(null)
    }
})

app.post('/setcity', (req, res) => {
    const { city } = req.body;

    res.cookie('city', city);

    res.json(city);
});

app.post('/getcity', async (req, res) => {
    const { info } = req.body;

    const { latitude, longitude } = info;

    const nearestTheater = await Theatre.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [longitude, latitude] },
                distanceField: "distance",
                spherical: true,
            }
        },
        { $limit: 1 }
    ])

    const city = nearestTheater[0].city;

    res.cookie('city', city);

    res.json(city);
})

// ! Admin verification

app.get('/admin?', async (req, res) => {
    const { admin } = req.cookies;
    if (admin) {
        jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
            if (err) throw err;
            const auth = await Admin.findById(adam.id);
            res.json(auth);
        })
    } else {
        res.json(null)
    }
})

app.post('/thumbnail', photosMiddleware.array('thumbnail', 100), async (req, res) => {

    const { path, mimetype } = req.files[0];

    const parts = mimetype.split('/');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const thumb = newPath.replace('uploads/', '');

    res.json(thumb);

})

app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' + newName,
    });
    res.json(newName);
});

app.post('/photos', photosMiddleware.array('photos', 100), async (req, res) => {
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const { path, mimetype } = req.files[i];
        const parts = mimetype.split('/');
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/', ''));
    }
    res.json(uploadedFiles);
});

// ! Movies 

app.post('/add-movie', async (req, res) => {
    const { admin } = req.cookies;
    const { name, syn, lang, thumbnail, addedPics, trailer, censor, releaseDate, endDate, avail, genre, screw } = req.body;

    if (admin) {
        jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
            if (err) throw err;
            await Movie.create({
                name: name,
                synopsis: syn,
                lang: lang,
                thumbnail: thumbnail,
                photos: addedPics,
                trailer: trailer,
                censor: censor,
                releaseDate: releaseDate,
                endDate: endDate,
                category: avail,
                genre: genre,
                castAndcrew: screw,
            })
        })
    } else {
        res.json(null)
    }
})

app.put('/update-movie', async (req, res) => {
    const { admin } = req.cookies;
    const { id, name, syn, lang, thumbnail, addedPics, trailer, censor, releaseDate, endDate, avail, genre, screw } = req.body;

    jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
        const movieDoc = await Movie.findById(id);
        movieDoc.set({
            name: name,
            synopsis: syn,
            lang: lang,
            thumbnail: thumbnail,
            photos: addedPics,
            trailer: trailer,
            censor: censor,
            releaseDate: releaseDate,
            endDate: endDate,
            category: avail,
            genre: genre,
            castAndcrew: screw,
        })
        movieDoc.save();
        res.json('Updated');
    })
})

app.put('/delete-movie/:id', async (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {

        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const movieDoc = await Movie.findById(req.params.id);

        if (!movieDoc) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        await movieDoc.deleteOne({ _id: req.params.id })
        res.json('Deleted')
    })
})

app.get('/showmovies', async (req, res) => {
    res.json(await Movie.find({
        $or: [
            { category: "Available" },
            { category: "Upcoming" }
        ]
    }).sort({ releaseDate: 1 }))
})

app.get('/getmovies', async (req, res) => {
    res.json(await Movie.find());
})

app.get('/searchmovies', async (req, res) => {
    try {

        const { key, page, limit } = req.query;
        const skip = (page - 1) * limit

        // const search = key ? {
        //     "$or": [
        //         { name: { $regex: key, $options: "i" } },
        //     ],
        // } : {}

        const search = key ? {
            category: { $in: ["Available", "Upcoming"] },
            name: { $regex: key, $options: "i" }
        } : {}

        const searchResult = await Movie.find(search).skip(skip).limit(limit)

        res.json(searchResult)

    } catch (error) {
        console.log(error)
    }
})

app.get('/movies/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Movie.findById(id));
})

app.post('/playingornot/', async (req, res) => {
    const { id, city } = req.body;

    const cityTheaters = await Theatre.find({ city: city })

    const filterSorted = cityTheaters.filter(theatre =>
        theatre.screens.some(screen => {
            return screen.currentMovie.movieID?.toString() === id;
        })
    );

    if (filterSorted.length > 0) {
        res.json(true)
    } else {
        res.json(false)
    }

})

// ! Theatres

app.post('/add-theatre', async (req, res) => {
    const { admin } = req.cookies;
    const { name, city, latitude, longitude, showTimings, screenInfo } = req.body;

    const location = [longitude, latitude]

    if (admin) {
        jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
            if (err) throw err;
            await Theatre.create({
                name: name,
                city: city,
                location: {
                    type: "Point",
                    coordinates: location
                },
                showTimings: showTimings,
                screens: screenInfo,
            })
        })
    } else {
        res.json(null)
    }
})

app.put('/update-theatre', async (req, res) => {
    const { admin } = req.cookies;
    const { id, name, city, latitude, longitude, showTimings, screenInfo } = req.body;

    const location = [longitude, latitude]

    jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
        const theatreDoc = await Theatre.findById(id);
        theatreDoc.set({
            name: name,
            city: city,
            location: {
                type: "Point",
                coordinates: location
            },
            showTimings: showTimings,
            screens: screenInfo,
        })
        theatreDoc.save();
        res.json('Updated');
    })
})

app.put('/delete-theatre/:id', async (req, res) => {
    const { token } = req.cookies;
    const theatreID = req.params.id;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const theatreDoc = await Theatre.findById(theatreID)
        await theatreDoc.deleteOne({ _id: theatreID })
        res.json('Deleted')
    })
})

app.get('/gettheatres', async (req, res) => {
    res.json(await Theatre.find());
})

app.post('/theaters/city', async (req, res) => {
    const { info, city } = req.body
    const { latitude, longitude } = info

    const sortedTheatres = await Theatre.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [longitude, latitude] },
                distanceField: "distance",
                spherical: true,
                query: { city: city }
            }
        },
    ])

    res.json(sortedTheatres);
})

app.get('/searchtheaters', async (req, res) => {

    try {
        const { key, page } = req.query;
        const search = key ? {
            "$or": [
                { name: { $regex: key, $options: "i" } },
                { city: { $regex: key, $options: "i" } }
            ]
        } : {}

        const searchResult = await Theatre.find(search)

        res.json(searchResult)

    } catch (error) {
        console.log(error)
    }

})

app.get('/theatres/:id', async (req, res) => {
    const { id } = req.params;
    res.json(await Theatre.findById(id));
})

app.get('/getscreens/:id', async (req, res) => {
    const { id } = req.params;

    res.json(await Theatre.find({ 'screens.currentMovie.movieID': id }));
})

app.post('/getsortedscreens', async (req, res) => {
    const { id, info, city } = req.body;

    const { latitude, longitude } = info;

    const sortedTheatres = await Theatre.aggregate([
        {
            $geoNear: {
                near: { type: "Point", coordinates: [longitude, latitude] },
                distanceField: "distance",
                spherical: true,
                query: { city: city }
            }
        },
    ])

    const filterSorted = sortedTheatres.filter(theatre =>
        theatre.screens.some(screen => {
            return screen.currentMovie.movieID?.toString() === id;
        })
    );

    res.json(filterSorted);

})

app.post('/subscribe', async (req, res) => {
    const { uid, id, rTheater, city } = req.body

    const { token } = req.cookies;

    const theaterDoc = await Theatre.findOne({ name: rTheater })

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) throw err;

        if (rTheater == 'Any Theater') {
            const genNotifyDoc = await GeneralNotify.findOne({ movieID: id, city: city })

            if (genNotifyDoc) {
                genNotifyDoc.emails.push(user.email)
                await genNotifyDoc.save();
                res.json(200)

            } else {
                await GeneralNotify.create({
                    movieID: id,
                    city: city,
                    emails: [user.email]
                })
                res.json(200)
            }
        } else {

            const notifyDoc = await PriorityNotify.findOne({ theaterID: theaterDoc._id, movieID: id })

            if (notifyDoc) {
                const userNotifyDoc = await PriorityNotify.findOne({
                    theaterID: theaterDoc._id,
                    movieID: id,
                    emails: user.email
                })

                if (userNotifyDoc) {
                    res.json(240)

                } else {
                    notifyDoc.emails.push(user.email)
                    await notifyDoc.save()
                    res.json(120)
                }

            } else {

                await PriorityNotify.create({
                    theaterID: theaterDoc._id,
                    theaterName: rTheater,
                    movieID: id,
                    emails: [user.email]
                })
                res.json(200)
            }
        }
    })
})

app.post('/pushnotifications', async (req, res) => {
    const { city, movieID, theaterID } = req.body;

    const notifyDoc = await PriorityNotify.findOne({ movieID: movieID, theaterID: theaterID })

    const genNotifyDoc = await GeneralNotify.findOne({ movieID: movieID, city: city })

    const movieDoc = await Movie.findById(movieID);
    const theaterDoc = await Theatre.findById(theaterID);

    const htmlPriorityNotify = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Tickets Update</title>
</head>

<body style="padding: 20px; font-family: Helvetica; line-height: 1.5; text-align: left;">

    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="left">
                <h2>
                    Tickets Opened for <span style="color: #f24c62; font-weight: bold;">${movieDoc.name}</span>
                </h2>
            </td>
        </tr>

        <tr>
            <td align="left">
                <div style="gap: 60px;">
                    <p style="font-size: 18px;">Hurry up!</p>
                    <p style="font-size: 18px; max-width: 600px;">
                        Tickets for "${movieDoc.name}" are now available in your preferred theater, <span style="color: #f24c62; font-weight: bold;">${theaterDoc.name}</span>.
                        Be among the first to secure your seats and experience the excitement on the big screen.
                    </p>
                </div>
            </td>
        </tr>

        <tr>
            <td align="left" style="padding-top: 15px;">
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" bgcolor="#f24c62" style="border-radius: 10px;">
                            <a href="${process.env.CLIENT_BASE_URL}/movies/${movieDoc._id}"
                                style="display: block; padding: 12px 27px; color: white; text-decoration: none; font-size: 18px;">
                                Book Now
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>

</html>`

    const htmlGenNotify = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Tickets Update</title>
</head>

<body style="padding: 20px; font-family: Helvetica; line-height: 1.5; text-align: left;">

    <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="left">
                <h2>
                    Tickets Opened for <span style="color: #f24c62; font-weight: bold;">${movieDoc.name}</span> in ${city}
                </h2>
            </td>
        </tr>

        <tr>
            <td align="left">
                <div style="gap: 60px;">
                    <p style="font-size: 18px;">Hurry up!</p>
                    <p style="font-size: 18px; max-width: 600px;">
                        Tickets for "${movieDoc.name}" are now available in ${city}, and you won’t want to miss this cinematic event.
                        Be among the first to secure your seats and experience the excitement on the big screen.
                    </p>
                </div>
            </td>
        </tr>

        <tr>
            <td align="left" style="padding-top: 15px;">
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" bgcolor="#f24c62" style="border-radius: 10px;">
                            <a href="${process.env.CLIENT_BASE_URL}/movies/${movieDoc._id}"
                                style="display: block; padding: 12px 27px; color: white; text-decoration: none; font-size: 18px;">
                                Book Now
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>

</body>

</html>`;

    const sendMail = async (transporter, mailOptions) => {
        try {
            await transporter.sendMail(mailOptions)
            console.log("Email sent")
        } catch (error) {

            console.log(error)
        }
    }

    if (genNotifyDoc) {

        const genMailOptions = {
            from: 'AMTBS <satwik058@gmail.com>',
            to: genNotifyDoc.emails,
            subject: `Tickets opened for "${movieDoc.name}" in ${city}`,
            text: "Hopefully this isn't under spam.",
            html: htmlGenNotify
        }

        sendMail(transporter, genMailOptions);
    }

    if (notifyDoc) {

        const priorityMailOptions = {
            from: 'AMTBS <satwik058@gmail.com>',
            to: notifyDoc.emails,
            subject: `Tickets opened for "${movieDoc.name}"`,
            text: "Hopefully this isn't under spam.",
            html: htmlPriorityNotify
        }

        sendMail(transporter, priorityMailOptions);
    }

    if (notifyDoc) {
        await notifyDoc.deleteOne({ movieID: movieID, theaterID: theaterID })
    }

    if (genNotifyDoc) {
        await genNotifyDoc.deleteOne({ movieID: movieID, city: city })
    }

    res.json("Done and Dusted");
})

// ! Logout

app.post('/logout', (req, res) => {
    res.cookie('token', '').json(true);
})

app.post('/admin/logout', (req, res) => {
    res.cookie('admin', '').json(true);
})

app.post('/crew', (req, res) => {
    const screw = req.body;
    res.json('OK');

    const { admin } = req.cookies;
    if (admin) {
        jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
            if (err) throw err;
            const auth = await Movie.findById(adam.id);
            res.json(auth);
        })
    } else {
        res.json(null)
    }
})

app.post('/confirm', async (req, res) => {
    const { token } = req.cookies;
    const bookingDetails = req.body;

    const userDoc = await User.findOne({ email: bookingDetails.email })

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        if (err) throw err;
        await Booking.create({
            movie: bookingDetails.id,
            user: userDoc._id,
            email: bookingDetails.email,
            bookingDate: bookingDetails.bookingDate,
            screen: bookingDetails.screen,
            screenName: bookingDetails.screenName,
            showTime: bookingDetails.showTime,
            seats: bookingDetails.selectedSeats,
            cost: bookingDetails.totalCost,
        })
    })
    res.json('Booking confirmed')

})

app.get('/bookings', (req, res) => {

    const { token } = req.cookies;

    jwt.verify(token, jwtSecret, {}, async (err, user) => {
        const userData = await getUserDataFromToken(req);
        res.json(await Booking.find({ user: userData.id }).populate('movie'));
    })

})

app.get('/bookings/:id', (req, res) => {

    const { admin } = req.cookies;
    const { id } = req.params;

    jwt.verify(admin, jwtSecret, {}, async (err, adam) => {
        const bookingDetails = await Booking.findById(id)

        res.json(bookingDetails);
    })
})

app.put('/reserve', async (req, res) => {
    const { id, email, bookingDate, screen, screenName, showTime, selectedSeats, totalCost } = req.body;

    const { token } = req.cookies;
    const userDoc = await User.findOne({ email })

    jwt.verify(token, jwtSecret, {}, async (err, adam) => {
        if (err) throw err;
        const showInstance = await ShowInstance.findOne({
            movie_id: id,
            screen: screen,
            screenName: screenName,
            show_date: bookingDate,
            show_time: showTime
        });

        console.log(showInstance)

        selectedSeats.forEach(seatNum => {
            const fSeatNum = seatNum.replace('_', '');

            const seat = showInstance.seats.get(fSeatNum); // Get the seat object
            seat.status = 'booked';
            seat.booked_by = userDoc._id;

            showInstance.seats.set(fSeatNum, seat);
        })
        await showInstance.save();

    })
    res.status(200).json('Seats updated successfully');
})

function initializeSeats() {
    const seats = new Map();

    // Add seats for rows A to E (17 seats per row)
    ['A', 'B', 'C', 'D', 'E'].forEach(row => {
        for (let i = 1; i <= 17; i++) {
            const seatNumber = `${row}${i}`;
            seats.set(seatNumber, { status: 'available', booked_by: null });
        }
    });

    // Add seats for rows F to H (14 seats per row)
    ['F', 'G', 'H'].forEach(row => {
        for (let i = 1; i <= 14; i++) {
            const seatNumber = `${row}${i}`;
            seats.set(seatNumber, { status: 'available', booked_by: null });
        }
    });

    return seats;
}

app.post('/getseatlayout', async (req, res) => {
    const { id, screen, screenName, bookingDate, showTime } = req.body;

    console.log({ id, screen, screenName, bookingDate, showTime })

    const showInstance = await ShowInstance.findOne({
        movie_id: id,
        screen: screen,
        screenName: screenName,
        show_date: bookingDate,
        show_time: showTime
    });

    console.log(showInstance)
    
    if (showInstance) {
        res.json(showInstance.seats)
    } else {
        await ShowInstance.create({
            movie_id: id,
            screen: screen,
            screenName: screenName,
            show_date: bookingDate,
            show_time: showTime,
            seats: initializeSeats() // Create default seats array
        });
        res.json("Wow you're first!")
    }
})

app.post('/getcoords', async (req, res) => {
    const { theatreID } = req.body;
    const theatreDoc = await Theatre.findById(theatreID)

    res.json(theatreDoc.location.coordinates)
    res.json();
})

app.post('/getdistance', async (req, res) => {
    const { theatreID, latitude, longitude } = req.body;
    res.json();
})

app.put('/verify-ticket', async (req, res) => {
    const { id } = req.body;

    const bookingDetails = await Booking.findById(id)
    const inValid = 420;

    if (bookingDetails.valid == false) {
        res.json(inValid)
    } else {
        bookingDetails.set({
            valid: false,
        })
        bookingDetails.save();
        res.json('Ticket Validated')
    }
})

const startServer = () => {
    try {
        app.listen(4000);
    } catch (err) {
        console.log(err)
    }
}

startServer();
