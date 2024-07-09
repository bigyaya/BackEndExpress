//Appel de la dépendance express
var express = require('express');

var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

var mongoose = require('mongoose');

//appel de la dépendance dotenv
require('dotenv').config();

const url = process.env.DATABASE_URL

mongoose.connect(url)
    .then(console.log("Mongodb Connected !"))
    .catch(error => console.log(error));

app.set('view engine', 'ejs');

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

app.use(express.static('public'));

//Import du model contact
var Contact = require("./models/Contact");
// import du model Blog
var Blog = require("./models/Blog");
// Modèle Car
const Car = require('./models/Car');
// Modèle User
const User = require('./models/User');
// bcrypt
const bcrypt = require('bcrypt');



// route pour l'affichage de la page inscription
app.get('/inscription', function (req, res) {
    res.render('Inscription');
})

// route pour l'enregistrement d'un user
app.post('/api/newuser', function (req, res) {
    const Data = new User({
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        // password: req.body.password,  // pour le moment on ne hash pas le password
        // password: bcrypt.hashSync(req.body.password, 10),
        // password: bcrypt.hashSync('password', 10), // exemple de hashage
        email: req.body.email,
        date: req.body.date,
        admin: false
    })
    console.log(Data);
    Data.save().then(() => {
        console.log('enregistrement réussi');
        res.redirect('/login');
    }).catch(error => console.log(error));
})




//route pour l'affichage de la page de connexion
//route pour l'affichage 'login'
app.get('/login', function (req, res) {
    res.render('Login');
})

//route pour la validation du formulaire de connexion avec sécurisation bcrypt
//gestion des validation de l'email et du password
app.post('/api/connexion', function (req, res) {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found: invalid email');
            }
            // console.log(user);
            if (!bcrypt.compareSync (req.body.password, user.password)) {
                return res.status(401).send('mot de passe incorrect');
            }
            if(user.admin == true){
                res.redirect('/admin');
            }

            res.render('Profil', {data: user})
        })
        .catch(error => {
            console.log(error);
            res.status(500).send('An error occurred');
        });
        
});

//route pour afficher la page Admin
app.get('/admin', function (req, res) {

    User.find().then(user => {
        res.render('Admin', { data: user });
    }).catch(error => console.log(error));

    // if (req.session.user && req.session.user.admin) {
    //     res.render('Admin');
    // } else {
    //     res.redirect('/login');
    // }
})


// app.post('/api/connexion', function (req, res) {
//     User.findOne({ username: req.body.username, password: req.body.password }).then(user => {
//         if (!user) return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
//         res.json({ message: 'Connexion réussie' });
//     }).catch(error => res.status(500).json({ error }));
// })









//lien pour afficher le formulaire
app.get('/newcar', function (req, res) {
    res.render('NewCar');
})

//sauvegarder le formulaire
app.post('/newcarsave', function (req, res) {
    const Data = new Car({
        image: req.body.image,
        marque: req.body.marque,
        modele: req.body.modele,
        description: req.body.description
    })
    Data.save().then(() => {
        console.log('enregistrement réussi');
        res.redirect('/allcars');
    }).catch(error => console.log(error));
})

//route pour afficher toutes les voitures
app.get('/allcars', function (req, res) {
    Car.find().then(data => {

        res.render('AllCar', { data: data });
    }).catch(error => console.log(error));
})

// route pour afficher une voiture en fonction de sont id
app.get('/editcar/:id', function (req, res) {
    Car.findOne({ _id: req.params.id }).then(data => {
        res.render('EditCar', { data: data });
    }).catch(error => console.log(error));
})

app.put('/updatecar/:id', function (req, res) {
    const Data = {
        image: req.body.image,
        marque: req.body.marque,
        modele: req.body.modele,
        description: req.body.description
    }
    Car.updateOne({ _id: req.params.id }, { $set: Data })
        .then((data) => {
            console.log("Voiture modifiée avec succès");
            res.redirect('/allcars');
        }).catch(error => console.log(error));
})

app.delete('/deletecar/:id', function (req, res) {
    Car.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            console.log('suppression réussi');
            res.redirect('/allcars');
        }).catch(error => console.log(error))
})

// app.post('/newcar', function (req, res) {
//     const newCar = new Car({
//         marque: req.body.marque,
//         modele: req.body.modele,
//         description: req.body.description
//     });
//     newCar.save().then(() => {
//         res.redirect('/allcars');
//     }).catch(error => console.log(error));
// });


// app.get('/editcar/:id', function (req, res) {
//     Car.findById(req.params.id).then(car => {
//         res.render('EditCar', { car: car });
//     }).catch(error => console.log(error));
// });

// app.put('/updatecar/:id', function (req, res) {
//     Car.updateOne({ _id: req.params.id }, {
//         marque: req.body.marque,
//         modele: req.body.modele,
//         description: req.body.description
//     }).then(() => {
//         res.redirect('/allcars');
//     }).catch(error => console.log(error));
// });

// app.delete('/deletecar/:id', function (req, res) {
//     Car.findByIdAndDelete(req.params.id).then(() => {
//         res.redirect('/allcars');
//     }).catch(error => console.log(error));
// });












/**
 * 
 * Partie Contact
 */

app.post("/nouveaucontact", function (req, res) {
    const Data = new Contact({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        message: req.body.message
    })
    Data.save()
        .then(() => {
            console.log("Contact saved !");
            res.redirect('/');
        })
        .catch(error => console.log(error));
});

// app.get('/', function (req, res) {
//     Contact.find().then(data=>{
//         console.log(data);
//         res.end();
//     })
//     .catch(error => console.log(error));
// });
// READ
app.get('/', function (req, res) {

    Contact.find().then(data => {
        res.render('Home', { data: data });
    })
        .catch(error => console.log(error));


});
// CREATE
app.get('/formulairecontact', function (req, res) {
    res.render('NewContact');
});
//Afficher page update
app.get('/contact/:identifiant', function (req, res) {
    Contact.findOne({
        _id: req.params.identifiant
    }).then(data => {
        res.render('EditContact', { data: data });
    })
        .catch(error => console.log(error));
})

//UPDATE

app.put('/updatecontact/:id', function (req, res) {
    const Data = {
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        message: req.body.message
    }
    //Matching : mise à jour si correspondance entre 
    // l'id présent dans la base (_id) et présent dans l'url (params.id)
    Contact.updateOne({ _id: req.params.id }, { $set: Data })
        .then(result => {
            console.log(result);
            console.log("contact updated !");
            res.redirect('/');
        })
        .catch(error => console.log(error));

})

//DELETE
app.delete('/deletecontact/:id', function (req, res) {
    Contact.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            console.log("contact deleted");
            res.redirect('/');
        })
        .catch(error => console.log(error));
});


//Permet de lire le fichier index.html 
// var path = require('path');


// app.get('/', function(req, res){
//     res.send("<html><body><h1>Express c'est génial</h1></body></html>");
// })

// app.get('/formulaire', function(req, res){
//     res.sendFile(path.resolve("index.html"));
// });

// app.get('/students', function(req, res){
//     res.send("<html><body><h1>Page Student !</h1></body></html>");
// });

// app.post('/submit-name', function(req, res){
//     // console.log("Votre nom est " + req.body.nom + " " + req.body.prenom);
//    res.send("Votre nom est " + req.body.nom + " " + req.body.prenom);

// })

// app.post('/contactform', function(req, res){
//     res.send("Bonjour " + req.body.nom + " " + req.body.prenom + ",<br>" 
//         + "Merci de nous avoir contacté.<br>Nous reviendrons vers vous dans les plus brefs délais : " 
//         + req.body.email ) ;
// })


/**
 * 
 * Partie Blog
 */
//Route pour afficher mon formulaire
app.get('/ajoutblog', function (req, res) {
    res.render('NewBlog')
})
//Route pour enregistrer/sauvegarder un blog
app.post('/nouveaublog', function (req, res) {
    const Data = new Blog({
        sujet: req.body.sujet,
        auteur: req.body.auteur,
        description: req.body.description,
        message: req.body.message
    })

    Data.save().then(() => {
        console.log('Blog enregistré !');
        res.redirect('/allposts');
    })
        .catch(error => console.log(error));
});

//Affichage de tout les blogs
app.get('/allposts', function (req, res) {
    Blog.find().then(data => {
        console.log("récuperation donnée réussi !");
        res.render('AllPosts', { data: data });
    })
        .catch(error => console.log(error));
});
//Edit
//Afficher une donnée sur la vue EditBlog en fonction de l'id mis en URL
app.get('/blog/:id', function (req, res) {
    Blog.findOne({ _id: req.params.id })
        .then(data => {
            res.render('EditBlog', { data: data });
        })
        .catch(error => console.log(error));
});

//Update :
app.put('/updateblog/:id', function (req, res) {
    const Data = {
        sujet: req.body.sujet,
        auteur: req.body.auteur,
        description: req.body.description,
        message: req.body.message
    }

    Blog.updateOne({ _id: req.params.id }, { $set: Data })
        .then(resultat => {
            console.log("Blog modifié avec succés");
            res.redirect('/allposts');
        })
        .catch(error => console.log(error));
})


//delete

app.delete('/deleteblog/:id', function (req, res) {
    Blog.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            console.log("Blog supprimmé avec succés");
            res.redirect('/allposts');
        })
        .catch(error => console.log(error));
});

var server = app.listen(5000, function () {
    console.log('Server listening on port 5000 !');
})