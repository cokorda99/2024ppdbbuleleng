angular.module('app.authentification', [])
    .controller('welcomeCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $rootScope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $('#jadwal-perankingan, #jadwal-pengumuman').hide();

        $scope.checkScreen = function () {
            if ($(window).width() < 1200) {
                $('.modal-dialog').addClass('modal-fullscreen-lg-down')
                $('#icon-group-1').addClass('order-2')
                $('#icon-group-2').addClass('order-1')
            }
            else {
                $('.modal-dialog').removeClass('modal-fullscreen-lg-down')
                $('#icon-group-1').removeClass('order-2')
                $('#icon-group-2').removeClass('order-1')
            }
            if ($(window).width() < 900) {
                $('.removeData, .detailData').addClass('btn-sm')
            }
            else {
                $('.removeData, .detailData').removeClass('btn-sm')
            }
        }
        $(window).resize(function () {
            $scope.checkScreen();
        });
        $scope.checkScreen();
        var BukaLoginPPDB = document.getElementById("logineppdb_open");
        BukaLoginPPDB.style.display = "none";

        var cekBukaPPDB = firebase.database().ref('pengaturan').child('buka_ppdb');
        cekBukaPPDB.on('value', (dataSnapShot) => {
            $scope.cekBukaPPDB = dataSnapShot.val().aktif;
            if ($scope.cekBukaPPDB == true) {
                BukaLoginPPDB.style.display = "block";
                var hash_location = window.location.hash;
                if (hash_location == "#/welcome") {
                    Swal.fire({
                        title: 'Pengumuman',
                        html: '<iframe  id="video_pengumuman"width="100%" height="400px" src="https://www.youtube.com/embed/-96lNqUFgHo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="display: block; margin-left: auto; margin-right: auto;"></iframe>',
                        showCloseButton: true,
                        focusConfirm: false
                    })
                }
            } else {
                firebase.auth().signOut();
                BukaLoginPPDB.style.display = "none";
                var hash_location = window.location.hash;
                if (hash_location == "#/welcome") {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Perhatian',
                        text: 'Untuk Sementara Sistem E-PPDB ditutup, Pendaftaran PPDB dibuka Tanggal 19 Juni 2023, Terimakasih',
                        focusConfirm: false
                    })
                }
            }
        })

        var loginsiswa = document.getElementById("login-info");
        var loginAdmin = document.getElementById("login-admin");
        var tombolloginsiswa = document.getElementById("tombol_loginsiswa");
        var tombolloginAdmin = document.getElementById("tombol_loginadmin");

        // tombolloginsiswa.style.display = "none";

        $scope.loginAdmin = function () {
            Swal.fire({
                title: 'Login Admin',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Dinas Pendidikan',
                denyButtonText: `Sekolah`,
                focusConfirm: false
            }).then((result) => {

                if (result.isConfirmed) {
                    // $rootScope.rememberLog();
                    loginsiswa.style.display = "none";
                    if (loginsiswa.style.display === "none") {
                        loginAdmin.style.display = "block";
                        tombolloginsiswa.style.display = "block";
                        tombolloginAdmin.style.display = "none";
                        if ($(window).width() < 514) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Perhatian',
                                text: 'Ukuran layar tidak disarankan!',
                                focusConfirm: false
                            })
                        }
                    } else {

                    }
                } else if (result.isDenied) {
                    // $rootScope.rememberLog();
                    loginsiswa.style.display = "none";
                    if (loginsiswa.style.display === "none") {
                        loginAdmin.style.display = "block";
                        tombolloginsiswa.style.display = "block";
                        tombolloginAdmin.style.display = "none";
                        if ($(window).width() < 514) {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Perhatian',
                                text: 'Ukuran layar tidak disarankan!',
                                focusConfirm: false
                            })
                        }
                    } else {

                    }
                }
            })

        }

        $scope.loginSiswa = function () {
            // $rootScope.rememberLog();
            loginAdmin.style.display = "none";
            if (loginAdmin.style.display === "none") {
                loginsiswa.style.display = "block";
                tombolloginsiswa.style.display = "none";
                tombolloginAdmin.style.display = "block";
            } else {

            }
        }
        $scope.loginAdminDinas = function () {
            $state.go('loginAdmin');
        }
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.show();

                firebase.database().ref('admin_sekolah').child(useraktif.uid).on('value', function (snapshot) {
                    if (snapshot.val()) {
                        // window.alert('Anda masuk sebagai Admin Sekolah');
                        $('#modal_pengumuman').modal('hide');
                        $state.go('berandaAdminSekolah', {
                            "idUser": useraktif.uid,
                        });
                    }
                    else {
                        firebase.database().ref('admin_sd').child(useraktif.uid).on('value', function (snapshot) {
                            if (snapshot.val()) {
                                // window.alert('Anda masuk sebagai Admin Sekolah');
                                $('#modal_pengumuman').modal('hide');
                                $state.go('berandaAdminSd', {
                                    "idUser": useraktif.uid,
                                });
                            }
                            else {
                                firebase.database().ref('admin_super').child(useraktif.uid).on('value', function (snapshot) {
                                    if (snapshot.val()) {
                                        $('#modal_pengumuman').modal('hide');
                                        $state.go('berandaAdminSuper', {
                                            "idUser": useraktif.uid,
                                        });
                                    }
                                    else {
                                        $('#modal_pengumuman').modal('hide');
                                        $state.go('dashboard', {
                                            "idUser": useraktif.uid,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });

            }
            else {

                $ionicLoading.hide();
                console.log('TIDAK AKTIF');

                
                $scope.login = function () {
                    var cekBukaLoginSiswa = firebase.database().ref('pengaturan').child('buka_loginSiswa');
                    cekBukaLoginSiswa.on('value', (dataSnapShot) => {
                        $scope.cekBukaLoginSiswa = dataSnapShot.val().aktif;
                        // $scope.cekBukaLoginSiswa = true;

                        if ($scope.cekBukaLoginSiswa == true) {
                            $ionicLoading.show();
                            var nisn = document.getElementById("nisn").value;
                            var password = document.getElementById("nisn").value;
                            var email = nisn + '@gmail.com';

                            if (nisn.length > 8) {
                                firebase.database().ref('datasiswa').orderByChild('nisn').equalTo(nisn).on('value', function (snapshot) {
                                    if (snapshot.val()) {
                                        firebase.database().ref('siswa').orderByChild('nisn').equalTo(nisn).on('value', function (snapshot) {
                                            if (snapshot.val()) {
                                                console.log('Terdaftar - tinggal login');

                                                $firebaseAuth().$signInWithEmailAndPassword(email, password).then(function (result) {
                                                    var userUid = result.user.uid;
                                                    $ionicLoading.hide();
                                                    $state.go('dashboard', {
                                                        "idUser": userUid,
                                                    });
                                                }).catch(function (error) {
                                                    var errorCode = error.code;
                                                    var errorMessage = error.message;
                                                    $ionicLoading.hide();

                                                    if (errorCode == 'auth/user-not-found') {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Error',
                                                            text: 'NISN Tidak Terdaftar',
                                                            focusConfirm: false
                                                        })

                                                    }
                                                    else if (errorCode == 'auth/wrong-password') {
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'NISN Salah',
                                                            focusConfirm: false
                                                        })
                                                    }
                                                    else {
                                                        Swal.fire({
                                                            icon: 'error',
                                                            title: 'Error',
                                                            text: errorMessage,
                                                            focusConfirm: false
                                                        })
                                                    }
                                                });
                                            } else {
                                                console.log('Belum Terdaftar dan harus signUp');
                                                firebase.database().ref('datasiswa').orderByChild('nisn').equalTo(nisn).on('value', function (snapshot) {
                                                    snapshot.forEach(function (data) {
                                                        let firebaseRefKey = firebase.database().ref('datasiswa').child(data.key);
                                                        firebaseRefKey.on('value', (dataSnapShot) => {
                                                            $scope.formData = {
                                                                "nisn": dataSnapShot.val().nisn,
                                                                "nama": dataSnapShot.val().nama,
                                                                "alamat": dataSnapShot.val().alamat,
                                                                "nik": dataSnapShot.val().nik,

                                                                "jenis_kelamin": dataSnapShot.val().jenis_kelamin,
                                                                "id_sekolah_asal": dataSnapShot.val().id_sd,
                                                                "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                                                "tanggal_lahir": dataSnapShot.val().tanggal_lahir,
                                                                "tempat_lahir": dataSnapShot.val().tempat_lahir,
                                                                "umur": dataSnapShot.val().umur,
                                                                "umur_display": dataSnapShot.val().umur_display,


                                                                "idBanjar": dataSnapShot.val().idBanjar,
                                                                "idDesa": dataSnapShot.val().idDesa,
                                                                "idKecamatan": dataSnapShot.val().idKecamatan,
                                                                "id_sd": dataSnapShot.val().id_sd,
                                                                "idsekolah_zonasi": dataSnapShot.val().idsekolah_zonasi,
                                                                "kordinatzonasi": dataSnapShot.val().kordinatzonasi,
                                                                "namaDesa": dataSnapShot.val().namaDesa,
                                                                "namaKecamatan": dataSnapShot.val().namaKecamatan,
                                                                "sekolah_zonasi": dataSnapShot.val().sekolah_zonasi,
                                                                "chekKordinat": dataSnapShot.val().chekKordinat,

                                                                "sekolahZonasiAlamat": dataSnapShot.val().alamatsekolahzonasi,
                                                            };
                                                        })
                                                        if ($scope.formData.idsekolah_zonasi == '-' || $scope.formData.idBanjar == '-' || $scope.formData.chekKordinat != true) {
                                                            $ionicLoading.hide();
                                                            Swal.fire({
                                                                icon: 'error',
                                                                title: 'ERROR',
                                                                text: 'Anda Belum bisa mendaftar karena kordinat tempat tinggal atau data dari admin sekolah belum lengkap, segera hubungi admin / operator sekolah SD anda',
                                                                focusConfirm: false
                                                            })
                                                        } else {
                                                            var auth = $firebaseAuth();
                                                            auth.$createUserWithEmailAndPassword(email, password)
                                                                .then(function (response) {
                                                                    var user = firebase.auth().currentUser;
                                                                    firebase.database().ref('siswa/' + user.uid).set({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        alamat: $scope.formData.alamat,
                                                                        nik: $scope.formData.nik,
                                                                        id_sd: $scope.formData.id_sekolah_asal,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        tanggal_lahir: $scope.formData.tanggal_lahir,
                                                                        tempat_lahir: $scope.formData.tempat_lahir,
                                                                        umur: $scope.formData.umur,
                                                                        umur_display: $scope.formData.umur_display,
                                                                        email: email,
                                                                        koreksi: null,
                                                                        password: password,
                                                                        status_terima: false,
                                                                        status_uprove: false,
                                                                        sttsDaftarUlang: false,
                                                                        status_daftarZonasi: false,
                                                                        status_daftarJalur: false,
                                                                        status_skl: false,
                                                                        uid: user.uid,
                                                                        jenis_kelamin: $scope.formData.jenis_kelamin,


                                                                        idDesa: $scope.formData.idDesa,
                                                                        idKecamatan: $scope.formData.idKecamatan,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        idsekolah_zonasi: $scope.formData.idsekolah_zonasi,
                                                                        alamatzonasi: $scope.formData.kordinatzonasi,
                                                                        namaDesa: $scope.formData.namaDesa,
                                                                        namaKecamatan: $scope.formData.namaKecamatan,
                                                                        sekolahZonasi: $scope.formData.sekolah_zonasi,
                                                                        sekolahZonasiAlamat: $scope.formData.sekolahZonasiAlamat


                                                                    });

                                                                    console.log('login Sukses');
                                                                })

                                                                .catch(function (error) {
                                                                    $ionicLoading.hide();
                                                                    Swal.fire({
                                                                        icon: 'error',
                                                                        title: 'Error',
                                                                        text: error,
                                                                        focusConfirm: false
                                                                    })
                                                                });
                                                        }
                                                    });
                                                    $ionicLoading.hide();
                                                })
                                            }
                                        });
                                    } else {
                                        $ionicLoading.hide();
                                        Swal.fire({
                                            icon: 'error',
                                            title: 'Error',
                                            text: 'NISN Tidak Terdaftar, silahkan hubungi helpdesk ',
                                            focusConfirm: false
                                        })

                                    }
                                });
                            } else {
                                $ionicLoading.hide();
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Perhatian',
                                    text: 'NISN Tidak Boleh Kosong atau Tidak sesuai Format',
                                    focusConfirm: false
                                })
                            }
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Pengumuman',
                                text: 'Akses login siswa belum dibuka, Mohon menunggu informasi selanjutnya',
                                focusConfirm: false
                            })
                        }
                    }
                    )



                }

                $scope.formData = {
                    "email": '',
                    "password": ''
                };
                // LOGIN ADMIN SEKOLAH
                $scope.masukAdmin = function () {
                    $ionicLoading.show();
                    // console.log(emailAdmin);
                    // console.log(passwordAdmin);
                    var emailAdmin = document.getElementById("email").value;
                    var passwordAdmin = document.getElementById("password").value;

                    if (emailAdmin.length > 0) {
                        if (passwordAdmin !== '') {
                            firebase.database().ref('admin_super').orderByChild('email').equalTo(emailAdmin).on('value', function (snapshot) {
                                if (snapshot.val()) {
                                    snapshot.forEach(function (data) {
                                        let idAdminSuper = data.key;
                                        console.log(idAdminSuper);
                                        firebase.database().ref('admin_super/' + idAdminSuper).on('value', function (dataSnapshot) {
                                            console.log(dataSnapshot.val().password);
                                            // $ionicLoading.hide();
                                            var passwordChek = dataSnapshot.val().passwordDisplay;
                                            var passwordLogin = String(dataSnapshot.val().password);

                                            if (passwordAdmin == passwordChek) {
                                                // console.log(passwordLogin);
                                                // window.alert(' MASUK admin super');
                                                $firebaseAuth().$signInWithEmailAndPassword(emailAdmin, passwordLogin).then(function (result) {
                                                    var userUid = result.user.uid;
                                                    $ionicLoading.hide();
                                                    // $scope.saveLogAdmin();
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
                                                        // return window.alert('Email tidak terdaftar sebagai admin');

                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
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
                                    // $firebaseAuth().$signInWithEmailAndPassword(emailAdmin, passwordAdmin).then(function (result) {
                                    //     var userUid = result.user.uid;
                                    //     $ionicLoading.hide();
                                    //     // $scope.saveLogAdmin();
                                    //     $state.go('berandaAdminSuper', {
                                    //         "idUser": userUid,
                                    //     });
                                    //     // window.alert('login berhasil');
                                    // }).catch(function (error) {
                                    //     // Handle Errors here.
                                    //     var errorCode = error.code;
                                    //     var errorMessage = error.message;
                                    //     $ionicLoading.hide();

                                    //     if (errorCode == 'auth/user-not-found') {
                                    //         Swal.fire({
                                    //             icon: 'warning',
                                    //             title: 'Perhatian',
                                    //             text: 'Email Tidak Terdaftar',
                                    //             focusConfirm: false
                                    //         })
                                    //     }
                                    //     else if (errorCode == 'auth/wrong-password') {
                                    //         Swal.fire({
                                    //             icon: 'warning',
                                    //             title: 'Perhatian',
                                    //             text: 'Password Salah',
                                    //             focusConfirm: false
                                    //         })

                                    //     }
                                    //     else {
                                    //         Swal.fire({
                                    //             icon: 'error',
                                    //             title: 'Error',
                                    //             text: errorMessage,
                                    //             focusConfirm: false
                                    //         })
                                    //         // return window.alert(errorMessage);

                                    //     }
                                    // });
                                } else {
                                    firebase.database().ref('admin_sekolah').orderByChild('email').equalTo(emailAdmin).on('value', function (dataSnapshot) {
                                        if (dataSnapshot.val()) {
                                            dataSnapshot.forEach(function (data) {
                                                let idAdmin = data.key;
                                                console.log(idAdmin);
                                                firebase.database().ref('admin_sekolah/' + idAdmin).on('value', function (dataSnapshot) {
                                                    console.log(dataSnapshot.val().password);
                                                    var passwordChek = dataSnapshot.val().passwordDisplay;
                                                    var passwordLogin = dataSnapshot.val().password;

                                                    if (passwordAdmin == passwordChek) {
                                                        console.log(passwordLogin);
                                                        // window.alert(' MASUK admin sekolah');
                                                        $firebaseAuth().$signInWithEmailAndPassword(emailAdmin, passwordLogin).then(function (result) {
                                                            var userUid = result.user.uid;
                                                            $ionicLoading.hide();
                                                            // $scope.saveLogAdmin();
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
                                                                    icon: 'warning',
                                                                    title: 'Perhatian',
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
                                            firebase.database().ref('admin_sd').orderByChild('email').equalTo(emailAdmin).on('value', function (dataSnapshot) {

                                                if (dataSnapshot.val()) {
                                                    dataSnapshot.forEach(function (data) {
                                                        let idAdmin = data.key;
                                                        console.log(idAdmin);
                                                        firebase.database().ref('admin_sd/' + idAdmin).on('value', function (dataSnapshot) {
                                                            console.log(dataSnapshot.val().password);
                                                            var passwordChek = dataSnapshot.val().passwordDisplay;
                                                            var passwordLogin = dataSnapshot.val().password;

                                                            if (passwordAdmin == passwordChek) {
                                                                console.log(passwordLogin);
                                                                // window.alert(' MASUK admin sekolah');
                                                                $firebaseAuth().$signInWithEmailAndPassword(emailAdmin, passwordLogin).then(function (result) {
                                                                    var userUid = result.user.uid;
                                                                    $ionicLoading.hide();
                                                                    // $scope.saveLogAdmin();
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
                                                                            icon: 'warning',
                                                                            title: 'Perhatian',
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
                                                    firebase.database().ref('sekolah').orderByChild('emailAdmin').equalTo(emailAdmin).on('value', function (dataSnapshot) {
                                                        if (dataSnapshot.val()) {
                                                            // window.alert('admin sekolah');
                                                            firebase.database().ref('sekolah').orderByChild('emailAdmin').equalTo(emailAdmin).on('value', function (snapshot) {
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
                                                                        auth.$createUserWithEmailAndPassword(emailAdmin, passwordAdmin)
                                                                            .then(function (response) {
                                                                                var user = firebase.auth().currentUser;
                                                                                firebase.database().ref('admin_sd/' + user.uid).set({
                                                                                    nama: 'ADMIN ' + $scope.formAdmin.sekolah,
                                                                                    npsn: $scope.formAdmin.npsn,
                                                                                    sekolah: $scope.formAdmin.sekolah,
                                                                                    email: emailAdmin,
                                                                                    password: passwordAdmin,
                                                                                    passwordDisplay: passwordAdmin,
                                                                                    id: user.uid,
                                                                                });
                                                                                // window.alert('Upload Berhasil')
                                                                                // $state.go('dashboard');
                                                                            })

                                                                            .catch(function (error) {
                                                                                $ionicLoading.hide();
                                                                                //console.log(error);
                                                                                // $ionicPopup.alert({
                                                                                //     title: 'Information',
                                                                                //     template: error.message,
                                                                                //     okType: 'button-positive'
                                                                                // });
                                                                                Swal.fire({
                                                                                    icon: 'error',
                                                                                    title: 'Error',
                                                                                    text: error,
                                                                                    focusConfirm: false
                                                                                })
                                                                            });

                                                                    } else {
                                                                        var auth = $firebaseAuth();
                                                                        auth.$createUserWithEmailAndPassword(emailAdmin, passwordAdmin)
                                                                            .then(function (response) {
                                                                                var user = firebase.auth().currentUser;
                                                                                firebase.database().ref('admin_sekolah/' + user.uid).set({
                                                                                    nama: 'ADMIN ' + $scope.formAdmin.sekolah,
                                                                                    npsn: $scope.formAdmin.npsn,
                                                                                    namaSekolah: $scope.formAdmin.sekolah,
                                                                                    email: emailAdmin,
                                                                                    password: passwordAdmin,
                                                                                    passwordDisplay: passwordAdmin,
                                                                                    noHp: '0',
                                                                                    id: user.uid,
                                                                                });
                                                                            })

                                                                            .catch(function (error) {
                                                                                $ionicLoading.hide();
                                                                                // $ionicPopup.alert({
                                                                                //     title: 'Information',
                                                                                //     template: error.message,
                                                                                //     okType: 'button-positive'
                                                                                // });
                                                                                Swal.fire({
                                                                                    icon: 'error',
                                                                                    title: 'Perhatian',
                                                                                    text: error,
                                                                                    focusConfirm: false
                                                                                })
                                                                            });

                                                                    }

                                                                });
                                                            })

                                                        } else {
                                                            $ionicLoading.hide();
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
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
                            Swal.fire({
                                icon: 'warning',
                                title: 'Perhatian',
                                text: 'Password Tidak Boleh Kosong',
                                focusConfirm: false
                            })
                        }

                    }
                    else {
                        $ionicLoading.hide();
                        // window.alert('Email tidak valid');
                        Swal.fire({
                            icon: 'warning',
                            title: 'Perhatian',
                            text: 'Email Tidak Boleh Kosong',
                            focusConfirm: false
                        })
                    }
                }
                $scope.checkNisnDaftar = function () {
                    var nisnCheck = document.getElementById("nisnCheck").value;
                    console.log(nisnCheck)
                    var cekBukaRegistrasi = firebase.database().ref('pengaturan').child('bukaRegistrasi');
                    cekBukaRegistrasi.on('value', (dataSnapShot) => {
                        $scope.cekBukaRegistrasi = dataSnapShot.val().aktif;
                        if ($scope.cekBukaRegistrasi == true) {
                            $ionicLoading.show();
                            if (nisnCheck != '') {
                                if (nisnCheck.length > 8) {
                                    firebase.database().ref('datasiswa').orderByChild('nisn').equalTo(nisnCheck).on('value', function (snapshot) {
                                        if (snapshot.val()) {
                                            $ionicLoading.hide();
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'Nisn Sudah Terdaftar, Silahkan lakukan Login untuk Masuk',
                                            })

                                        } else {
                                            $ionicLoading.hide();
                                            localStorage.setItem('nisn', nisnCheck);
                                            console.log('LANJUT PROSES REGISTRASI');
                                            $state.go("registrasiSiswa")
                                        }
                                    });
                                } else {
                                    $ionicLoading.hide();
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'ERROR',
                                        text: 'Nisn Tidak Sesuai Format',
                                    })
                                }
                            } else {
                                $ionicLoading.hide();
                                Swal.fire({
                                    icon: 'error',
                                    title: 'ERROR',
                                    text: 'Nisn Tidak Boleh kosong',
                                })
                            }
                        } else {
                            $ionicLoading.hide();
                            Swal.fire({
                                icon: 'warning',
                                title: 'Perhatian',
                                text: 'Menu Pendaftaran Belum dibuka mohon ditunggu beberapa saat lagi',
                            })
                        }
                    })

                }
            }
        });
    }])

    .controller('registrasiSiswaCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $rootScope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        nisnGet = localStorage.getItem('nisn');
        document.getElementById("nisnSiswa").value = nisnGet;
        $scope.form = {
            "idKecamatan": "",
            "idDesa": "",
            "idBanjar": "",

        }

        $scope.registrasi = false;

        var refKecamatan = firebase.database().ref("kecamatan");
        $scope.dataKecamatan = $firebaseArray(refKecamatan);

        $scope.getIdKecamatan = function () {
            var idKecamatan = $scope.form.idKecamatan;
            $scope.idKecamatan = $scope.form.idKecamatan;
            //Get Nama Kecamatan
            var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
            var listNamaKecamatan = $firebaseArray(namaKecamatan);
            listNamaKecamatan.$loaded().then(function (response) {
                $scope.namaKecamatan = response[0].nama_kecamatan;
                $scope.id_kecamatan = response[0].id_kecamatan;

            });

            var refDesa = firebase.database().ref("desa").orderByChild("id_kecamatan").equalTo(idKecamatan);
            // var refDesa = firebase.database().ref("desa");
            $scope.dataDesa = $firebaseArray(refDesa);
        }

        $scope.getIdDesa = function () {
            var idDesa = $scope.form.idDesa;
            $scope.idDesa = $scope.form.idDesa;
            //Get Nama Kecamatan
            var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
            var listNamaDesa = $firebaseArray(namaDesa);
            listNamaDesa.$loaded().then(function (response) {
                $scope.namaDesa = response[0].nama_desa;
                $scope.id_desa = response[0].id_desa;
                // $scope.sklhNama1 = response[0].nama_smp;
                // $scope.sklhId1 = response[0].id_smp;
                // $scope.sklhAlamat1 = response[0].alamat_smp;
            });

            var refBanjar = firebase.database().ref("banjar").orderByChild("id_desa").equalTo(idDesa);
            // var refDesa = firebase.database().ref("desa");
            $scope.dataBanjar = $firebaseArray(refBanjar);
        }
        $scope.getIdBanjar = function () {
            var idBanjar = $scope.form.idBanjar;
            $scope.idBanjar = $scope.form.idBanjar;
            //Get Nama Kecamatan
            var namaBanjar = firebase.database().ref("banjar").orderByChild("id_banjar").equalTo(idBanjar);
            var listNamaBanjar = $firebaseArray(namaBanjar);
            listNamaBanjar.$loaded().then(function (response) {
                $scope.namaBanjar = response[0].nama_banjar;
                $scope.id_desa = response[0].id_banjar;

                $scope.sklhNama1 = response[0].nama_smp;
                $scope.sklhId1 = response[0].id_smp;
                $scope.sklhAlamat1 = response[0].alamat_smp;
            });

        }

        $scope.simpanTambahDataSiswa = function () {
            // var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
            var namaSiswa = document.getElementById("namaSiswa").value;
            var AlamatSiswa = document.getElementById("AlamatSiswa").value;
            var npsnSiswa = document.getElementById("npsnSiswa").value;
            var NikSiswa = document.getElementById("nikSiswa").value;
            var nisnSiswa = document.getElementById("nisnSiswa").value;
            var SekolahSiswa = document.getElementById("sekolahSiswa").value;
            var tglLahirSiswa = document.getElementById("tglLahirSiswa").value;
            var tempatLahirSiswa = document.getElementById("tempatLahirSiswa").value;
            var kordinatSiswa = document.getElementById("Alamatkoordinat").value;
            var jenis_kelamin = document.getElementById("jenisKelaminSiswa").value;
            var notelpSiswa = document.getElementById("notelpSiswa").value;

            var namaIbu = document.getElementById("namaIbu").value;
            var pekerjaanIbu = document.getElementById("pekerjaanIbu").value;
            var penghasilanIbu = document.getElementById("penghasilanIbu").value;
            var namaAyah = document.getElementById("namaAyah").value;

            var pekerjaanAyah = document.getElementById("pekerjaanAyah").value;
            var penghasilanAyah = document.getElementById("penghasilanAyah").value;
            var namaWali = document.getElementById("namaWali").value;
            var pekerjaanWali = document.getElementById("pekerjaanWali").value;
            var penghasilanWali = document.getElementById("penghasilanWali").value;
            var fileCheck = document.getElementById("UploadSurat").value;

            if (kordinatSiswa.length!=0 && fileCheck.length !=0 && namaSiswa.length != 0 && notelpSiswa != 0 && AlamatSiswa.length != 0 && npsnSiswa.length != 0 && NikSiswa.length != 0 && nisnSiswa.length >= 8 && SekolahSiswa.length != 0 && tglLahirSiswa.length != 0 && tempatLahirSiswa.length != 0 && namaAyah.length != 0 && pekerjaanAyah.length != 0 && penghasilanAyah.length != 0 && namaIbu.length != 0 && pekerjaanIbu.length != 0 && penghasilanIbu.length != 0) {
                // $ionicLoading.show();
                if (namaWali.length == 0 && pekerjaanWali.length == 0 && penghasilanWali.length == 0) {
                    var ref = firebase.database().ref("datasiswaverif/" + nisnSiswa);
                    ref.set({
                        alamat: AlamatSiswa,
                        alamatsekolahzonasi : $scope.sklhAlamat1,
                        id_sd: npsnSiswa,
                        id_smp_pilihan: "",
                        nama: namaSiswa,
                        nama_smp_pilihan: "",
                        nik: NikSiswa,
                        nisn: nisnSiswa,
                        noHp: notelpSiswa,
                        sekolah_asal: SekolahSiswa,
                        tanggal_lahir: tglLahirSiswa,
                        tempat_lahir: tempatLahirSiswa,
                        umur: "4483",
                        umur_display: "12 tahun 3 bulan 8 hari",
                        jenis_kelamin: jenis_kelamin,

                        idBanjar : $scope.form.idBanjar,
                        idDesa: $scope.form.idDesa,
                        idKecamatan: $scope.form.idKecamatan,
                        idsekolah_zonasi: $scope.sklhId1,
                        namaBanjar: $scope.namaBanjar,
                        namaDesa: $scope.namaDesa,
                        namaKecamatan: $scope.namaKecamatan,
                        sekolah_zonasi: $scope.sklhNama1,
                        kordinatzonasi: kordinatSiswa,

                        ayah_nama: namaAyah,
                        ayah_pekerjaan: pekerjaanAyah,
                        ayah_penghasilan: penghasilanAyah,

                        ibu_nama: namaIbu,
                        ibu_pekerjaan: pekerjaanIbu,
                        ibu_penghasilan: penghasilanIbu,

                        status_verif: false,

                        wali_nama: '-',
                        wali_pekerjaan: '-',
                        wali_penghasilan: '-',

                    }).then(function (resp) {
                        var ref = firebase.database().ref("datasiswa_belumdaftar/" + nisnSiswa);
                        ref.set({
                            // alamat: AlamatSiswa,
                            // id_sd: npsnSiswa,
                            // id_smp_pilihan: "",
                            nama: namaSiswa,
                            // nama_smp_pilihan: "",
                            // nik: NikSiswa,
                            nisn: nisnSiswa,
                            sekolah_asal: SekolahSiswa,
                            // tanggal_lahir: tglLahirSiswa,
                            // tempat_lahir: tempatLahirSiswa,
                            // umur: "4483",
                            // umur_display: "12 tahun 3 bulan 8 hari",
                            sekolah_zonasi: $scope.sklhNama1,

                        }).then(function (resp) {

                            $ionicLoading.hide();
                            // window.alert('Upload Sukses');
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Registrasi Berhasil',
                            })
                            document.getElementById("form-tambah-siswa-rayon").reset();
                            $ionicLoading.hide()
                            // $state.go("menuAdmin.dataSekolahAdmin")
                        })
                    })
                } else {
                    var ref = firebase.database().ref("datasiswaverif/" + nisnSiswa);
                    ref.set({
                        alamat: AlamatSiswa,
                        alamatsekolahzonasi : $scope.sklhAlamat1,
                        id_sd: npsnSiswa,
                        id_smp_pilihan: "",
                        nama: namaSiswa,
                        nama_smp_pilihan: "",
                        nik: NikSiswa,
                        nisn: nisnSiswa,
                        sekolah_asal: SekolahSiswa,
                        tanggal_lahir: tglLahirSiswa,
                        tempat_lahir: tempatLahirSiswa,
                        umur: "4483",
                        umur_display: "12 tahun 3 bulan 8 hari",
                        jenis_kelamin: jenis_kelamin,
                        // create_by: $scope.formData.nama
                        idBanjar : $scope.form.idBanjar,
                        idDesa: $scope.form.idDesa,
                        idKecamatan: $scope.form.idKecamatan,
                        idsekolah_zonasi: $scope.sklhId1,

                        namaBanjar: $scope.namaBanjar,
                        namaDesa: $scope.namaDesa,
                        namaKecamatan: $scope.namaKecamatan,
                        sekolah_zonasi: $scope.sklhNama1,
                        kordinatzonasi: kordinatSiswa,

                        ayah_nama: namaAyah,
                        ayah_pekerjaan: pekerjaanAyah,
                        ayah_penghasilan: penghasilanAyah,

                        ibu_nama: namaIbu,
                        ibu_pekerjaan: pekerjaanIbu,
                        ibu_penghasilan: penghasilanIbu,

                        wali_nama: namaWali,
                        wali_pekerjaan: pekerjaanWali,
                        wali_penghasilan: penghasilanWali,

                        status_verif: false,

                    }).then(function (resp) {
                        var ref = firebase.database().ref("datasiswa_belumdaftar/" + nisnSiswa);
                        ref.set({
                            // alamat: AlamatSiswa,
                            // id_sd: npsnSiswa,
                            // id_smp_pilihan: "",
                            nama: namaSiswa,
                            // nama_smp_pilihan: "",
                            // nik: NikSiswa,
                            nisn: nisnSiswa,
                            sekolah_asal: SekolahSiswa,
                            // tanggal_lahir: tglLahirSiswa,
                            // tempat_lahir: tempatLahirSiswa,
                            // umur: "4483",
                            // umur_display: "12 tahun 3 bulan 8 hari",
                            sekolah_zonasi: $scope.sklhNama1,


                        }).then(function (resp) {

                            $ionicLoading.hide();
                            // window.alert('Upload Sukses');
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Registrasi Berhasil',
                            })
                            document.getElementById("form-tambah-siswa-rayon").reset();
                            $ionicLoading.hide()
                        })
                    })
                }

                // File 
                var storageRefDok = firebase.storage().ref("registrasi/" + nisnSiswa + "/" + 'Dok');
                var storageDok = $firebaseStorage(storageRefDok);
                var fileDok = document.getElementById("UploadSurat").files[0];

                var metadata = {
                    contentType: fileDok.type
                }
                //Upload File
                var uploadTask = storageDok.$put(fileDok);
                $ionicLoading.show();
                uploadTask.$complete(function (snapshot) {
                    //console.log(snapshot);
                    storageRefDok.getDownloadURL().then(function (url) {
                        //console.log(url);
                        var refAddFoto = firebase.database().ref('datasiswaverif/' + nisnSiswa + '/fileDok')
                        refAddFoto.set({
                            "URL": url,
                            "namaFile": snapshot.metadata.name
                        }).then(function (response) {
                            $ionicLoading.hide();
                            ////console.log(response);
                            return true;
                        }).then(function (error) {
                            ////console.log(error);
                        });
                    }).catch(function (error) {
                        // Handle any errors
                    });
                })

                $scope.registrasi = true;
                y = document.getElementById("content");
                y.style.display = "none";
            }
            else {
                $ionicLoading.hide();
                // window.alert('Data Belum Lengkap');
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Data Belum Lengkap',
                })

            }
        }

    }])
