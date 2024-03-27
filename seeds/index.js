const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

db.on('error', () => {
    console.error(`Error connecting in seeds: $(e)`);
});
db.once('open', () => {
    console.log('Seeds db connection success');
})

function sample(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}


const seedDB = async () => {
    await Campground.deleteMany();
    for (let i = 0; i < 50; i++) {
        const rand = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 1;
        const camp = new Campground({
            author: '65f137b323e08102974f85ab',
            location: `${cities[rand].city}, ${cities[rand].state}`,
            image: 'https://source.unsplash.com/collection/483251',
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price: price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    db.close();
})