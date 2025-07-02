
function GenreSelect({ genre, onChange }) {


    function labelStyle(type = null) {

        let labelStyle = "flex gap-2.5 items-center border py-3.5 px-4 rounded-[0.5em] text-[1.1em] shadow-sm shadow-gray-100";
        if (genre.includes(type)) {
            labelStyle += ' bg-zinc-200/[0.7]'
        } else {
            labelStyle += 'bg-white'
        }

        return labelStyle;
    }

    function handleCheckBox(ev) {
        const { checked, name } = ev.target;
        if (checked) {
            onChange([...genre, name]);
        } else {
            onChange([...genre.filter(label => label != name)]);
        }
    }



    return (
        <div className="mt-5">
            <h2 className="text-xl">Genre</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 mt-3">
                <label className={labelStyle('Action')}>
                    <input type="checkbox" checked={genre.includes('Action')} name="Action" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🔫</span>
                    <span>Action</span>
                </label>
                <label className={labelStyle('Drama')}>
                    <input type="checkbox" checked={genre.includes('Drama')} name="Drama" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🎭</span>
                    <span>Drama</span>
                </label>
                <label className={labelStyle('Adventure')}>
                    <input type="checkbox" checked={genre.includes('Adventure')} name="Adventure" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🏞️</span>
                    <span>Adventure</span>
                </label>
                <label className={labelStyle('Sci-Fi')}>
                    <input type="checkbox" checked={genre.includes('Sci-Fi')} name="Sci-Fi" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🚀</span>
                    <span>Sci-Fi</span>
                </label>
                <label className={labelStyle('Thriller')}>
                    <input type="checkbox" checked={genre.includes('Thriller')} name="Thriller" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">😨</span>
                    <span>Thriller</span>
                </label>
                <label className={labelStyle('Horror')}>
                    <input type="checkbox" checked={genre.includes('Horror')} name="Horror" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">👻</span>
                    <span>Horror</span>
                </label>
                <label className={labelStyle('Romance')}>
                    <input type="checkbox" checked={genre.includes('Romance')} name="Romance" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">❤️</span>
                    <span>Romance</span>
                </label>
                <label className={labelStyle('Comedy')}>
                    <input type="checkbox" checked={genre.includes('Comedy')} name="Comedy" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">😂</span>
                    <span>Comedy</span>
                </label>
                <label className={labelStyle('Fantasy')}>
                    <input type="checkbox" checked={genre.includes('Fantasy')} name="Fantasy" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🦄</span>
                    <span>Fantasy</span>
                </label>
                <label className={labelStyle('Musical')}>
                    <input type="checkbox" checked={genre.includes('Musical')} name="Musical" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🎵</span>
                    <span>Musical</span>
                </label>
                <label className={labelStyle('Biography')}>
                    <input type="checkbox" checked={genre.includes('Biography')} name="Biography" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">📖</span>
                    <span>Biography</span>
                </label>
                <label className={labelStyle('Periodic')}>
                    <input type="checkbox" checked={genre.includes('Periodic')} name="Periodic" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🐎</span>
                    <span>Periodic</span>
                </label>
                <label className={labelStyle('Superhero')}>
                    <input type="checkbox" checked={genre.includes('Superhero')} name="Superhero" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🦸</span>
                    <span>Superhero</span>
                </label>
                <label className={labelStyle('Animation')}>
                    <input type="checkbox" checked={genre.includes('Animation')} name="Animation" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">👾</span>
                    <span>Animation</span>
                </label>
                <label className={labelStyle('Crime')}>
                    <input type="checkbox" checked={genre.includes('Crime')} name="Crime" onChange={handleCheckBox} />
                    <span className="text-2xl text-primary">🔪</span>
                    <span className="text-ellipsis">Crime</span>
                </label>



            </div>
        </div>
    );
}

export default GenreSelect;