angular.module('app.authAdmin', [])
    .controller('loginAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-email-tidak-ditemukan").hide();
        $("#alert-emailAdmin-tidak-ditemukan").hide();
        $("#alert-password-salah").hide();

        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // firebase.auth().signOut();
                // console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                // console.log(useraktif.uid)
                $ionicLoading.show();

                firebase.database().ref('admin').child(useraktif.uid).on('value', function (snapshot) {
                    if (snapshot.val()) {
                        // window.alert('Anda masuk sebagai Admin Sekolah');
                        $('#modal_pengumuman').modal('hide');
                        $state.go('berandaAdmin', {
                            "idUser": useraktif.uid,
                        });
                    }
                });

            }
            else {
                $ionicLoading.hide();
                // console.log('TIDAK AKTIF');
                $scope.formData = {
                    "nama": '',
                    "password": '',
                    "namaAdmin": '',
                    "passwordAdmin": ''
                };

                // LOGIN ADMIN
                $scope.masuk = function () {
                    $ionicLoading.show();
                    // console.log($scope.formData.nama);
                    // console.log($scope.formData.password);
                    var email = $scope.formData.email
                    if ($scope.formData.email) {
                        if ($scope.formData.password !== '') {
                            firebase.database().ref('admin').orderByChild('email').equalTo(email).on('value', function (dataSnapshot) {
                                if (dataSnapshot.val()) {
                                    dataSnapshot.forEach(function (data) {
                                        let idAdmin = data.key;
                                        // console.log(idAdmin);
                                        firebase.database().ref('admin/' + idAdmin).on('value', function (dataSnapshot) {
                                            // console.log(dataSnapshot.val().password);
                                            var passwordChek = dataSnapshot.val().passwordDisplay;
                                            var passwordLogin = dataSnapshot.val().password;

                                            if ($scope.formData.password == passwordChek) {
                                                // console.log(passwordLogin);
                                                // window.alert(' MASUK admin sekolah');
                                                $firebaseAuth().$signInWithEmailAndPassword(email, passwordLogin).then(function (result) {
                                                    var userUid = result.user.uid;
                                                    $ionicLoading.hide();
                                                    $state.go('berandaAdmin', {
                                                        "idUser": userUid,
                                                    });
                                                    // window.alert('login berhasil');
                                                }).catch(function (error) {
                                                    // Handle Errors here.
                                                    var errorCode = error.code;
                                                    var errorMessage = error.message;
                                                    $ionicLoading.hide();

                                                    if (errorCode == 'auth/user-not-found') {
                                                        // return window.alert('Email tidak terdaftar sebagai admin');
                                                        $("#alert-emailAdmin-tidak-ditemukan").show(function () {
                                                            $("#alert-emailAdmin-tidak-ditemukan").fadeTo(2000, 500).slideUp(500, function () {
                                                                $("#alert-emailAdmin-tidak-ditemukan").slideUp(500);
                                                            });
                                                        });
                                                    }
                                                    else if (errorCode == 'auth/wrong-password') {
                                                        $("#alert-password-salah").show(function () {
                                                            $("#alert-password-salah").fadeTo(2000, 500).slideUp(500, function () {
                                                                $("#alert-password-salah").slideUp(500);
                                                            });
                                                        });
                                                        // return window.alert('Password tidak sesuai');
                                                    }
                                                    else {
                                                        return window.alert(errorMessage);
                                                    }
                                                });
                                            } else {
                                                // window.alert("ERROR")
                                                $ionicLoading.hide();
                                                $("#alert-password-salah").show(function () {
                                                    $("#alert-password-salah").fadeTo(2000, 500).slideUp(500, function () {
                                                        $("#alert-password-salah").slideUp(500);
                                                    });
                                                });

                                            }
                                        })
                                    })
                                }
                                else {
                                    $ionicLoading.hide();
                                    // window.alert('Email tidak valid');
                                    $("#alert-email-tidak-ditemukan").show(function () {
                                        $("#alert-email-tidak-ditemukan").fadeTo(2000, 500).slideUp(500, function () {
                                            $("#alert-email-tidak-ditemukan").slideUp(500);
                                        });
                                    });
                                }
                            });
                        } else {
                            $ionicLoading.hide();
                            // window.alert('Password tidak boleh kosong');
                        }
                        $("#alert-password-kosong").show(function () {
                            $("#alert-password-kosong").fadeTo(2000, 500).slideUp(500, function () {
                                $("#alert-password-kosong").slideUp(500);
                            });
                        });
                    }
                    else {
                        $ionicLoading.hide();
                        // window.alert('Email tidak valid');
                        $("#alert-email-tidak-ditemukan").show(function () {
                            $("#alert-email-tidak-ditemukan").fadeTo(2000, 500).slideUp(500, function () {
                                $("#alert-email-tidak-ditemukan").slideUp(500);
                            });
                        });
                    }
                }
            }
        });
    }])



