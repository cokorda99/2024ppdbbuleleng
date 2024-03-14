angular.module('app.authAdmin', [])

    .controller('loginAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        console.log('TIDAK AKTIF');
        $scope.formData = {
            "email": '',
            "password": '',
            // "sebagai": ''
        };

        $scope.loginAdmin = function () {
            $ionicLoading.show();
            console.log($scope.formData.email);
            console.log($scope.formData.password);
            if ($scope.formData.email) {
                if ($scope.formData.password !== '') {
                    firebase.database().ref('admin_super').orderByChild('email').equalTo($scope.formData.email).on('value', function (snapshot) {
                        if (snapshot.val()) {
                            $firebaseAuth().$signInWithEmailAndPassword($scope.formData.email, $scope.formData.password).then(function (result) {
                                var userUid = result.user.uid;
                                $ionicLoading.hide();
                                $state.go('berandaAdminSuper', {
                                    "idUser": userUid,
                                });
                                // window.alert('login berhasil');
                            }).catch(function (error) {
                                // Handle Errors here.
                                var errorCode = error.code;
                                var errorMessage = error.message;
                                $ionicLoading.hide();

                                if (errorCode == 'auth/user-not-found') {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: 'Email Tidak Terdaftar',
                                        focusConfirm: false
                                      })
                                    // return window.alert('Email tidak terdaftar sebagai admin');
                                }
                                else if (errorCode == 'auth/wrong-password') {
                                    Swal.fire({
                                        icon: 'warning',
                                        title: 'Perhatian',
                                        text: 'Password Salah',
                                        focusConfirm: false
                                      })
                                    // return window.alert('Password tidak sesuai');

                                }
                                else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: errorMessage,
                                        focusConfirm: false
                                      })
                                    // return window.alert(errorMessage);
                                    
                                }
                            });
                        } else {
                            firebase.database().ref('admin_sekolah').orderByChild('email').equalTo($scope.formData.email).on('value', function (dataSnapshot) {
                                if (dataSnapshot.val()) {
                                    dataSnapshot.forEach(function (data) {
                                        let idAdmin = data.key;
                                        console.log(idAdmin);
                                        firebase.database().ref('admin_sekolah/' + idAdmin).on('value', function (dataSnapshot) {
                                            console.log(dataSnapshot.val().password);
                                            var passwordChek = dataSnapshot.val().passwordDisplay;
                                            var passwordLogin = dataSnapshot.val().password;

                                            if ($scope.formData.password == passwordChek) {
                                                console.log(passwordLogin);
                                                    // window.alert(' MASUK admin sekolah');
                                                    $firebaseAuth().$signInWithEmailAndPassword($scope.formData.email, passwordLogin).then(function (result) {
                                                        var userUid = result.user.uid;
                                                        $ionicLoading.hide();
                                                        $state.go('berandaAdminSekolah', {
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
                                                            Swal.fire({
                                                                icon: 'error',
                                                                title: 'Error',
                                                                text: 'Email Tidak Terdaftar',
                                                                focusConfirm: false
                                                              })
                                                        }
                                                        else if (errorCode == 'auth/wrong-password') {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Password Salah',
                                                                focusConfirm: false
                                                              })
                                                            // return window.alert('Password tidak sesuai');
                                                        }
                                                        else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: errorMessage,
                                                                focusConfirm: false
                                                              })
                                                            // return window.alert(errorMessage);
                                                        }
                                                    });
                                            } else {
                                                // window.alert("ERROR")
                                                $ionicLoading.hide();
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Perhatian',
                                                    text: 'Password Salah',
                                                    focusConfirm: false
                                                  })

                                            }
                                        })
                                    })
                                } else {
                                    firebase.database().ref('admin_sd').orderByChild('email').equalTo($scope.formData.email).on('value', function (dataSnapshot) {

                                        if (dataSnapshot.val()) {
                                            dataSnapshot.forEach(function (data) {
                                                let idAdmin = data.key;
                                                console.log(idAdmin);
                                                firebase.database().ref('admin_sd/' + idAdmin).on('value', function (dataSnapshot) {
                                                    console.log(dataSnapshot.val().password);
                                                    var passwordChek = dataSnapshot.val().passwordDisplay;
                                                    var passwordLogin = dataSnapshot.val().password;

                                                    if ($scope.formData.password == passwordChek) {
                                                        console.log(passwordLogin);
                                                            // window.alert(' MASUK admin sekolah');
                                                            $firebaseAuth().$signInWithEmailAndPassword($scope.formData.email, passwordLogin).then(function (result) {
                                                                var userUid = result.user.uid;
                                                                $ionicLoading.hide();
                                                                $state.go('berandaAdminSd', {
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
                                                                    Swal.fire({
                                                                        icon: 'error',
                                                                        title: 'Error',
                                                                        text: 'Email Tidak Terdaftar',
                                                                        focusConfirm: false
                                                                      })
                                                                }
                                                                else if (errorCode == 'auth/wrong-password') {
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Password Salah',
                                                                        focusConfirm: false
                                                                      })
                                                                    // return window.alert('Password tidak sesuai');
                                                                }
                                                                else {
                                                                    Swal.fire({
                                                                        icon: 'error',
                                                                        title: 'Error',
                                                                        text: errorMessage,
                                                                        focusConfirm: false
                                                                      })
                                                                    // return window.alert(errorMessage);
                                                                }
                                                            });
                                                    } else {
                                                        // window.alert("ERROR")
                                                        $ionicLoading.hide();
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Password Salah',
                                                            focusConfirm: false
                                                          })

                                                    }
                                                })
                                            })

                                        } else {
                                            // $ionicLoading.hide();
                                            // return window.alert('Email tidak terdaftar sebagai admin');
                                            // window.alert('gagal');
                                            firebase.database().ref('sekolah').orderByChild('emailAdmin').equalTo($scope.formData.email).on('value', function (dataSnapshot) {
                                                if (dataSnapshot.val()) {
                                                    // window.alert('admin sekolah');
                                                    firebase.database().ref('sekolah').orderByChild('emailAdmin').equalTo($scope.formData.email).on('value', function (snapshot) {
                                                        snapshot.forEach(function (data) {
                                                            // console.log(data.key);
                                                            let firebaseRefKey = firebase.database().ref('sekolah').child(data.key);
                                                            firebaseRefKey.on('value', (dataSnapShot) => {
                                                                $scope.formAdmin = {
                                                                    "npsn": dataSnapShot.val().npsn,
                                                                    "sekolah": dataSnapShot.val().sekolah,
                                                                    "jenjang": dataSnapShot.val().jenjang,
                                                                };
                                                            })
                                                            $ionicLoading.hide();
                                                            console.log($scope.formAdmin.jenjang);
                                                            if ($scope.formAdmin.jenjang == 'SD') {
                                                                var auth = $firebaseAuth();
                                                                auth.$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password)
                                                                    .then(function (response) {
                                                                        var user = firebase.auth().currentUser;
                                                                        firebase.database().ref('admin_sd/' + user.uid).set({
                                                                            nama: 'ADMIN ' + $scope.formAdmin.sekolah,
                                                                            npsn: $scope.formAdmin.npsn,
                                                                            sekolah: $scope.formAdmin.sekolah,
                                                                            email: $scope.formData.email,
                                                                            password: $scope.formData.password,
                                                                            passwordDisplay: $scope.formData.password,
                                                                            id: user.uid,
                                                                        });
                                                                        // window.alert('Upload Berhasil')
                                                                        // $state.go('dashboard');
                                                                    })

                                                                    .catch(function (error) {
                                                                        $ionicLoading.hide();
                                                                        //console.log(error);
                                                                        Swal.fire({
                                                                            icon: 'error',
                                                                            title: 'Error',
                                                                            text: error.message,
                                                                            focusConfirm: false
                                                                          })
                                                                    });

                                                            } else {
                                                                var auth = $firebaseAuth();
                                                                auth.$createUserWithEmailAndPassword($scope.formData.email, $scope.formData.password)
                                                                    .then(function (response) {
                                                                        var user = firebase.auth().currentUser;
                                                                        console.log(user);
                                                                        // firebase.database().ref('admin_sekolah/' + user.uid).set({
                                                                        //     nama: 'ADMIN ' + $scope.formAdmin.sekolah,
                                                                        //     npsn: $scope.formAdmin.npsn,
                                                                        //     namaSekolah: $scope.formAdmin.sekolah,
                                                                        //     email: $scope.formData.email,
                                                                        //     password: $scope.formData.password,
                                                                        //     passwordDisplay: $scope.formData.password,
                                                                        //     id: user.uid,
                                                                        // });
                                                                        // window.alert('Upload Berhasil')
                                                                        // $state.go('dashboard');
                                                                    })

                                                                    .catch(function (error) {
                                                                        $ionicLoading.hide();
                                                                        //console.log(error);
                                                                        Swal.fire({
                                                                            icon: 'error',
                                                                            title: 'Error',
                                                                            text: error.message,
                                                                            focusConfirm: false
                                                                          })
                                                                    });

                                                            }

                                                        });
                                                    })

                                                } else {
                                                    $ionicLoading.hide();
                                                    Swal.fire({
                                                        icon: 'error',
                                                        title: 'Error',
                                                        text: 'Email Tidak Terdaftar',
                                                        focusConfirm: false
                                                      })
                                                    // return window.alert('Email tidak terdaftar sebagai admin');
                                                    // window.alert('gagal');
                                                }
                                            });

                                        }
                                    });
                                }
                            });

                        }
                    });
                } else {
                    $ionicLoading.hide();
                    // window.alert('Password tidak boleh kosong');
                }
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Password tidak boleh kosong',
                    focusConfirm: false
                  })
            }
            else {
                $ionicLoading.hide();
                // window.alert('Email tidak valid');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Email Tidak Terdaftar',
                    focusConfirm: false
                  })
            }
        }
        $scope.loginSiswa = function () {
            $state.go('welcome');
        }

    }])

The deployment has been disabled DEPLOYMENT_DISABLED