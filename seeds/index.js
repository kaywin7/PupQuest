const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Vect = require('../models/vect');

// console.log(cities[1])
mongoose.connect('mongodb://127.0.0.1:27017/pup-quest2');
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Vect.deleteMany({});
    for (let i = 0; i < 400; i++) {
        const random1000 = Math.floor(Math.random() * 4000);
        const doctor = 'Rajest';
        const shelt = new Vect({
            author: '6481a8812d82cbe74128af7b',
            location: `${cities[random1000].city}, ${cities[random1000].admin_name}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dhkol7six/image/upload/v1683611479/PupQuest/guqm27cdj3hlz3htyj6w.jpg',
                    filename: 'PupQuest/guqm27cdj3hlz3htyj6w'
                }
            ],
            description: "  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laborum corporis, provident, voluptates minus sint quo mollitia necessitatibus asperiores nesciunt consectetur fuga cum blanditiis aut, nihil minima incidunt tempore magnam explicabo. Animi quia ex, eum debitis totam voluptates adipisci similique culpa est sequi.Quos nemo consequatur aspernatur! Non magni atque necessitatibus sequi et minus autem, vitae, cum sit est at recusandae?Modi facere quis perferendis architecto cumque dolore autem voluptates nam eligendi fugiat ad vitae voluptas excepturi, voluptatum repellat ducimus odio.Minima optio labore doloribus sit fugit corrupti nisi laborum excepturi.",
            doctor,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].lng,
                    cities[random1000].lat,
                ]
            },
        })
        await shelt.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})