

export const uniqueFileNameGenerator = (filename) => {
        const getRandom = (random) => random.toString().substring(random.toString().indexOf(".")+1);
        const ext = filename.substring(filename.lastIndexOf(".")+1)
        return `${Date.now().toString() + getRandom(Math.random().toFixed(6)) + getRandom(Math.random().toFixed(6)) + '.' + ext}`
}