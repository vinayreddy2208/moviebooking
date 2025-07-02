import { motion } from 'framer-motion';

function LanguageSelect({ lang, onChange }) {

    function labelStyle(type = null) {

        let labelStyle = "flex gap-2.5 items-center border py-3.5 px-4 rounded-[0.5em] text-[1.1em] shadow-sm shadow-gray-100";
        if (lang.includes(type)) {
            labelStyle += ' bg-zinc-200/[0.7]'
        } else {
            labelStyle += 'bg-white'
        }

        return labelStyle;
    }


    function handleCheckBox(ev) {
        const { checked, name } = ev.target;
        if (checked) {
            onChange([...lang, name]);
        } else {
            onChange([...lang.filter(label => label != name)]);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-2">
            <h2 className="text-xl">Language</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 mt-3">
                <label className={labelStyle('Hindi')}>
                    <input type="checkbox" checked={lang.includes('Hindi')} name="Hindi" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary">अ</span>
                    <span>Hindi</span>
                </label>
                <label className={labelStyle('Telugu')}>
                    <input type="checkbox" checked={lang.includes('Telugu')} name="Telugu" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary mb-0.5">అ</span>
                    <span>Telugu</span>
                </label>
                <label className={labelStyle('Tamil')}>
                    <input type="checkbox" checked={lang.includes('Tamil')} name="Tamil" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary mb-1">அ</span>
                    <span>Tamil</span>
                </label>
                <label className={labelStyle('English')}>
                    <input type="checkbox" checked={lang.includes('English')} name="English" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary">A</span>
                    <span>English</span>
                </label>
                <label className={labelStyle('Malayalam')}>
                    <input type="checkbox" checked={lang.includes('Malayalam')} name="Malayalam" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary mb-1">അ</span>
                    <span className=''>Malayalam</span>
                </label>
                <label className={labelStyle('Kannada')}>
                    <input type="checkbox" checked={lang.includes('Kannada')} name="Kannada" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary mb-1">ಖ</span>
                    <span>Kannada</span>
                </label>
                <label className={labelStyle('Bengali')}>
                    <input type="checkbox" checked={lang.includes('Bengali')} name="Bengali" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary">অ</span>
                    <span>Bengali</span>
                </label>
                <label className={labelStyle('Punjabi')}>
                    <input type="checkbox" checked={lang.includes('Punjabi')} name="Punjabi" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary">ਅ</span>
                    <span>Punjabi</span>
                </label>
                <label className={labelStyle('Bhojpuri')}>
                    <input type="checkbox" checked={lang.includes('Bhojpuri')} name="Bhojpuri" onChange={handleCheckBox} />
                    <span className="text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl text-primary">अ</span>
                    <span>Bhojpuri</span>
                </label>
            </div>
        </motion.div>
    );
}

export default LanguageSelect;