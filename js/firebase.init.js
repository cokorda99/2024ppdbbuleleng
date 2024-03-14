angular.module('firebaseConfig', ['firebase'])

    .run(function () {

        // My app's Firebase configuration
        var config = {
            apiKey: "AIzaSyCFg3be3acJIfcI9lcxPpQ-upH9qyGsOIc",
            authDomain: "ppdbbuleleng2024.firebaseapp.com",
            databaseURL: "https://ppdbbuleleng2024-default-rtdb.firebaseio.com",
            projectId: "ppdbbuleleng2024",
            storageBucket: "ppdbbuleleng2024.appspot.com",
            messagingSenderId: "585974161783",
            appId: "1:585974161783:web:494987652b3cea9cd78172",
            measurementId: "G-8NG52QZW1L"

            // apiKey: "AIzaSyCSTmZ5UESSEN74RAjQhMTRAOOKW6zEmnE",
            // authDomain: "ppdbbuleleng.firebaseapp.com",
            // databaseURL: "https://ppdbbuleleng-default-rtdb.firebaseio.com",
            // projectId: "ppdbbuleleng",
            // storageBucket: "ppdbbuleleng.appspot.com",
            // messagingSenderId: "326346817953",
            // appId: "1:326346817953:web:5f19daedd4b1fb3a094be0",
            // measurementId: "G-169M8WVJFR"
        };
        // Initialize Firebase
        firebase.initializeApp(config);
        // firebase.analytics();


    })

/*

.service("TodoExample", ["$firebaseArray", function($firebaseArray){
    var ref = firebase.database().ref().child("todos");
    var items = $firebaseArray(ref);
    var todos = {
        items: items,
        addItem: function(title){
            items.$add({
                title: title,
                finished: false
            })
        },
        setFinished: function(item, newV){
            item.finished = newV;
            items.$save(item);
        }
    }
    return todos;
}])

*/




// angular.module('firebaseConfig', ['firebase'])

//     .run(function () {

//         // My app's Firebase configuration
//         var config = {
//             apiKey: "AIzaSyBEk-ynCcQyVkDqhTDNOyO-CSCzkbar0JA",
//             authDomain: "denpasar-10e2a.firebaseapp.com",
//             databaseURL: "https://denpasar-10e2a.firebaseio.com",
//             projectId: "denpasar",
//             storageBucket: "denpasar.appspot.com",
//             messagingSenderId: "76976225491",
//             appId: "1:76976225491:web:7c589489dbad41f530a826",
//             measurementId: "G-ZS8LB8SZRZ"
//         };
//         // Initialize Firebase
//         firebase.initializeApp(config);
//         // firebase.analytics();


//     })

// /*

// .service("TodoExample", ["$firebaseArray", function($firebaseArray){
//     var ref = firebase.database().ref().child("todos");
//     var items = $firebaseArray(ref);
//     var todos = {
//         items: items,
//         addItem: function(title){
//             items.$add({
//                 title: title,
//                 finished: false
//             })
//         },
//         setFinished: function(item, newV){
//             item.finished = newV;
//             items.$save(item);
//         }
//     }
//     return todos;
// }])

// */