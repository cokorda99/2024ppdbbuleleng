angular.module('app.dataPendaftarAdminSuper', [])
    .controller('dataPendaftarSMPAdminSuperMenuCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var sekolahID = $stateParams.idSekolah;


        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").addClass('text-light').removeClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer ").addClass('text-light bg-night').removeClass('text-dark');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").removeClass('text-light').addClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer").addClass('text-dark').removeClass('text-light bg-night');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
                $("#btn-look-pass, #btn-back ").removeClass('btn-primary').addClass('btn-outline-primary');
            }
        }


        if (window.localStorage.nightActive == 'on') {
            $('#nightmode').addClass("night-active");

        } else {
            $('#nightmode').removeClass("night-active");
        }
        $scope.nightActive();


        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        $scope.nightmode = function () {
            if (window.localStorage.nightActive != "on") {
                $('#nightmode').addClass("night-active");
                window.localStorage.nightActive = "on";

            } else {
                $('#nightmode').removeClass("night-active");
                window.localStorage.nightActive = "";
            }
            $scope.nightActive();
        }
        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // window.alert(sekolahID);
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })
                var ref = firebase.database().ref("siswa").orderByChild('status_daftarZonasi').equalTo(true);
                var listRef = $firebaseArray(ref);

                $ionicLoading.show();
                listRef.$loaded().then(function (response) {
                    $ionicLoading.hide();
                    console.log(response);
                    $scope.jumlah_pendaftar_siswa = response.length;
                    $scope.pendaftar_siswa = response;

                })


                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                let ceknamaSekolah = firebase.database().ref('sekolah').child(sekolahID);
                ceknamaSekolah.on('value', (dataSnapShot) => {
                    $scope.formData = {
                        // "nip": dataSnapShot.val().nip,
                        "namaSekolah": dataSnapShot.val().sekolah,
                    };

                    // window.alert($scope.formData.namaSekolah)
                })

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }

    }])
    .controller('dataPendaftarAdminSuperCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;


        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").addClass('text-light').removeClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer ").addClass('text-light bg-night').removeClass('text-dark');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").removeClass('text-light').addClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer").addClass('text-dark').removeClass('text-light bg-night');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
                $("#btn-look-pass, #btn-back ").removeClass('btn-primary').addClass('btn-outline-primary');
            }
        }


        if (window.localStorage.nightActive == 'on') {
            $('#nightmode').addClass("night-active");

        } else {
            $('#nightmode').removeClass("night-active");
        }
        $scope.nightActive();


        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        $scope.nightmode = function () {
            if (window.localStorage.nightActive != "on") {
                $('#nightmode').addClass("night-active");
                window.localStorage.nightActive = "on";

            } else {
                $('#nightmode').removeClass("night-active");
                window.localStorage.nightActive = "";
            }
            $scope.nightActive();
        }

        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftar', function () {
                    updateID = $(this).attr('data-id');
                    $('#modal_edit').modal('hide');
                    $state.go('dataPendaftarSMPAdminSuper', {
                        "idSekolah": updateID,
                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_smp = response.length;
            $scope.sekolah_smp = response;

        })

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }

    }])
    .controller('dataPendaftarSMPAdminSuperCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var sekolahID = $stateParams.idSekolah;


        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").addClass('text-light').removeClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer ").addClass('text-light bg-night').removeClass('text-dark');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").removeClass('text-light').addClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer").addClass('text-dark').removeClass('text-light bg-night');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
                $("#btn-look-pass, #btn-back ").removeClass('btn-primary').addClass('btn-outline-primary');
            }
        }


        if (window.localStorage.nightActive == 'on') {
            $('#nightmode').addClass("night-active");

        } else {
            $('#nightmode').removeClass("night-active");
        }
        $scope.nightActive();


        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        $scope.nightmode = function () {
            if (window.localStorage.nightActive != "on") {
                $('#nightmode').addClass("night-active");
                window.localStorage.nightActive = "on";

            } else {
                $('#nightmode').removeClass("night-active");
                window.localStorage.nightActive = "";
            }
            $scope.nightActive();
        }
        // var canvas_jalur = document.getElementById('chart_jalur').getContext('2d');
        // var canvas_status = document.getElementById('chart_status_pendaftaran').getContext('2d');
        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // window.alert(sekolahID);
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                let ceknamaSekolah = firebase.database().ref('sekolah').child(sekolahID);
                ceknamaSekolah.on('value', (dataSnapShot) => {
                    $scope.formData = {
                        // "nip": dataSnapShot.val().nip,
                        "namaSekolah": dataSnapShot.val().sekolah,
                    };

                    // window.alert($scope.formData.namaSekolah)
                })

                // LOAD JUMLAH PENDAFTAR ZONASI
                // var ref = firebase.database().ref("smp/" + sekolahID + "/zonasi_rank");
                // var listRef = $firebaseArray(ref);
                // $ionicLoading.show();
                // listRef.$loaded().then(function (response) {
                //     $ionicLoading.hide();
                //     console.log(response.length);
                //     $scope.jumlahsiswazonasi = response.length;

                //     for (data in response) {
                //         // console.log(response[data].nisn)
                //         if (response[data].nisn != undefined) {
                //             if (response[data].status_uprove == true) {
                //                 // UPDATE DATABASE Status Zonasi
                //                 console.log(response[data].uid);
                //                 firebase.database().ref("siswa/"+ response[data].uid).update({
                //                     status_terima: true,

                //                     // poinPrestasi:parseFloat(response[data].poinPrestasi),
                //                 }).then(function (response) {
                //                     console.log('UPDATE PADA RANKING Zonasi')
                //                 });
                //             } else {
                //                 console.log('SKIP BELUM VALID')
                //             }
                //         } else {
                //             console.log('SKIP')
                //         }
                //     }
                // })


                // LOAD JUMLAH PENDAFTAR ZONASI
                var ref = firebase.database().ref("smp/" + sekolahID + "/zonasi");
                var listRef = $firebaseArray(ref);
                $ionicLoading.show();
                listRef.$loaded().then(function (response) {
                    $ionicLoading.hide();
                    console.log(response.length);
                    $scope.jumlahsiswazonasi = response.length;

                    // for (data in response) {
                    //     // console.log(response[data].nisn)
                    //     if (response[data].nisn != undefined) {
                    //         if (response[data].status_uprove == true) {
                    //             // UPDATE DATABASE RANKING Prestasi
                    //             console.log(response[data]);
                    //             firebase.database().ref("smp/" + sekolahID + "/zonasi_rank/" + response[data].uid).update({
                    //                 // finalPoin:response[data].finalPoin,
                    //                 id_sd: response[data].id_sd,
                    //                 jalur: "zonasi",
                    //                 jalurNama: "Zonasi",
                    //                 jarak: response[data].jarak,
                    //                 nama: response[data].nama,
                    //                 nisn: response[data].nisn,
                    //                 no_pendaftaran: response[data].no_pendaftaran,
                    //                 poinStatusKK: response[data].poinStatusKK,
                    //                 sekolah_asal: response[data].sekolah_asal,
                    //                 statusKK: response[data].statusKK,
                    //                 status_terima: false,
                    //                 status_uprove: response[data].status_uprove,
                    //                 uid: response[data].uid,

                    //                 // poinPrestasi:parseFloat(response[data].poinPrestasi),
                    //             }).then(function (response) {
                    //                 console.log('UPDATE PADA RANKING Zonasi')
                    //             });
                    //         } else {
                    //             console.log('SKIP BELUM VALID')
                    //         }
                    //     } else {
                    //         console.log('SKIP')
                    //     }
                    // }
                })

                // LOAD JUMLAH PENDAFTAR AFIRMASI
                var ref = firebase.database().ref("smp/" + sekolahID + "/afirmasi");
                var listRef = $firebaseArray(ref);

                $ionicLoading.show();
                listRef.$loaded().then(function (response) {
                    $ionicLoading.hide();
                    console.log(response.length);
                    $scope.jumlahsiswaafirmasi = response.length;

                    // for (data in response) {
                    //     // console.log(response[data].nisn)
                    //     if (response[data].nisn != undefined) {
                    //         if (response[data].status_uprove2 == true) {
                    //             // UPDATE DATABASE RANKING Prestasi
                    //             firebase.database().ref("smp/" + sekolahID + "/afirmasi_rank/" + response[data].uid).update({
                    //                 status_uprove2: true,
                    //                 jalur2: response[data].jalur2,
                    //                 jalurNama2: response[data].jalurNama2,
                    //                 no_pendaftaran2: response[data].no_pendaftaran2,
                    //                 // poinPrestasi:parseFloat(response[data].poinPrestasi),
                    //             }).then(function (response) {
                    //                 console.log('UPDATE PADA RANKING AFIRMASI')
                    //             });
                    //         } else {
                    //             console.log('SKIP BELUM VALID')
                    //         }
                    //     } else {
                    //         console.log('SKIP')
                    //     }
                    // }
                })

                // LOAD JUMLAH PENDAFTAR PRESTASI
                var ref = firebase.database().ref("smp/" + sekolahID + "/prestasi");
                var listRef = $firebaseArray(ref);
                $ionicLoading.show();
                listRef.$loaded().then(function (response) {
                    $ionicLoading.hide();
                    console.log(response.length);
                    $scope.jumlahsiswaprestasi = response.length;

                    // for (data in response) {
                    //     // console.log(response[data].nisn)
                    //     if (response[data].nisn != undefined) {
                    //         if (response[data].status_uprove2 == true) {

                    //             // UPDATE DATABASE RANKING Prestasi
                    //             firebase.database().ref("smp/" + sekolahID + "/prestasi_rank/" + response[data].uid).update({
                    //                 status_uprove2: true,
                    //                 jalur2: response[data].jalur2,
                    //                 jalurNama2: response[data].jalurNama2,
                    //                 no_pendaftaran2: response[data].no_pendaftaran2,
                    //                 poinPrestasi: parseFloat(response[data].poinPrestasi),
                    //             }).then(function (response) {
                    //                 console.log('UPDATE PADA RANKING PRESTASI')
                    //             });
                    //         } else {
                    //             console.log('SKIP BELUM VALID')
                    //         }
                    //     } else {
                    //         console.log('SKIP')
                    //     }
                    // }
                })

                // LOAD JUMLAH PENDAFTAR PERPINDAHAN
                var ref = firebase.database().ref("smp/" + sekolahID + "/perpindahan");
                var listRef = $firebaseArray(ref);

                $ionicLoading.show();
                listRef.$loaded().then(function (response) {
                    $ionicLoading.hide();
                    console.log(response.length);
                    $scope.jumlahsiswaperpindahan = response.length;

                    // for (data in response) {
                    //     // console.log(response[data].nisn)
                    //     if (response[data].nisn != undefined) {
                    //         if (response[data].status_uprove2 == true) {
                    //             console.log('UPDATE PADA RANKING PERPINDAHAN')
                    //             // UPDATE DATABASE RANKING Prestasi
                    //             firebase.database().ref("smp/" + sekolahID + "/perpindahan_rank/" + response[data].uid).update({
                    //                 status_uprove2: true,
                    //                 jalur2: response[data].jalur2,
                    //                 jalurNama2: response[data].jalurNama2,
                    //                 no_pendaftaran2: response[data].no_pendaftaran2,
                    //                 finalPoin: response[data].finalPoin,
                    //                 jarak: response[data].jarak,
                    //                 nama: response[data].nama,
                    //                 nisn: response[data].nisn,
                    //                 poinStatusKK: response[data].poinStatusKK,
                    //                 sekolah_asal: response[data].sekolah_asal,
                    //                 status_terima: false,
                    //                 uid: response[data].uid
                    //                 // poinPrestasi:parseFloat(response[data].poinPrestasi),
                    //             }).then(function (response) {
                    //                 console.log('UPDATE PADA RANKING PERPINDAHAN')
                    //             });
                    //         } else {
                    //             console.log('SKIP BELUM VALID')
                    //         }
                    //     } else {
                    //         console.log('SKIP')
                    //     }
                    // }

                })

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }

    }])
    .controller('dataPendaftarSeluruhSMPCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


        var userID = $stateParams.idUser;

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
        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").addClass('text-light').removeClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer ").addClass('text-light bg-night').removeClass('text-dark');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link, .modal-title ").removeClass('text-light').addClass('text-dark');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header, .modal-footer").addClass('text-dark').removeClass('text-light bg-night');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
                $("#btn-look-pass, #btn-back ").removeClass('btn-primary').addClass('btn-outline-primary');
            }
        }


        if (window.localStorage.nightActive == 'on') {
            $('#nightmode').addClass("night-active");

        } else {
            $('#nightmode').removeClass("night-active");
        }
        $scope.nightActive();


        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        $scope.nightmode = function () {
            if (window.localStorage.nightActive != "on") {
                $('#nightmode').addClass("night-active");
                window.localStorage.nightActive = "on";

            } else {
                $('#nightmode').removeClass("night-active");
                window.localStorage.nightActive = "";
            }
            $scope.nightActive();
        }

        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }

        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-seluruh-smp'));
                    XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
                }

                $scope.jalan = function () {
                    console.log('JALAN')
                    var ref = firebase.database().ref("siswa");
                    var listRef = $firebaseArray(ref);
                    listRef.$loaded().then(function (response) {
                        console.log(response);
                        for (let index = 0; index < response.length; index++) {
                            // console.log(response[index]);
                            // console.log(response[index].status_skl);
                            if (response[index].status_daftarZonasi == true) {
                                console.log('SKIP DAH DAFTAR');
                            } else {
                                firebase.database().ref('siswa/' + response[index].uid).update({
                                    status_skl: false,

                                }).then(function () {
                                    console.log("Update " + index, response[index].nisn);
                                })
                            }
                        }
                    })
                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftarAfirmasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifAfirmasi").value = values.nisn;
                        document.getElementById("nikVerifAfirmasi").value = values.nik;
                        document.getElementById("namaVerifAfirmasi").value = values.nama;
                        document.getElementById("alamatsiswaVerifAfirmasi").value = values.alamat;
                        document.getElementById("alamatVerifAfirmasi").value = values.alamatzonasi;
                        document.getElementById("sekolahVerifAfirmasi").value = values.sekolah_asal;
                        document.getElementById("tglLahirVerifAfirmasi").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifAfirmasi").value = values.jarak;
                        document.getElementById("noSKLVerifAfirmasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifAfirmasi").value = values.nilai_skl;
                        document.getElementById("noKKVerifAfirmasi").value = values.noKK;
                        document.getElementById("statusKKVerifAfirmasi").value = values.statusKK;
                        console.log(values.uid);


                        document.getElementById("jenisDokumenAfirmasi").value = values.dokumenAfirmasi;


                        firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                            var data = snapshot.val();
                            var url = data.URL
                            console.log(url);

                            $scope.lihatFileSKL = function () {
                                window.open(url);
                            }
                        })

                        firebase.database().ref('siswa/' + updateID + '/fileDok').on('value', function (snapshot) {
                            var data = snapshot.val();
                            var url = data.URL
                            console.log(url);

                            $scope.lihatFileAfirmasi = function () {
                                window.open(url);
                            }
                        })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.verifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });

                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarPrestasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifPrestasi").value = values.nisn;
                        document.getElementById("nikVerifPrestasi").value = values.nik;
                        document.getElementById("namaVerifPrestasi").value = values.nama;
                        // document.getElementById("alamatVerif").value = values.alamatzonasi + " , " + values.namaDesa;
                        document.getElementById("tglLahirVerifPrestasi").value = values.tanggal_lahir;
                        document.getElementById("poinPrestasi").value = values.poinPrestasi;
                        document.getElementById("noSKLVerifPrestasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifPrestasi").value = values.nilai_skl;
                        document.getElementById("sekolahAsalSDPrestasi").value = values.sekolah_asal;

                        // document.getElementById("berkasPress").value = values.berkasprestasi;
                        $scope.jenisPress = values.jenisPrestasi;
                        if ($scope.jenisPress !== 'keterampilan') {
                            $('#berkasBuktiPrestasi').show();
                            $('#berkasBuktiKeterampilan').hide();

                        } else {
                            $('#berkasBuktiPrestasi').hide();
                            $('#berkasBuktiKeterampilan').show();
                        }
                        document.getElementById("jenisPress").value = values.jenisPrestasi;

                        document.getElementById("tingkatPress").value = values.tingkatprestasi;
                        document.getElementById("namaKompDes").value = values.namaKompetisi;
                        document.getElementById("cabangKompeti").value = values.cabangKompetisi;
                        document.getElementById("peringkatPress").value = values.juaraPrestasi;
                        document.getElementById("akumulasiNilaiRap").value = values.akumulasiRaportPrestasi;


                        firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                            var data = snapshot.val();
                            var url = data.URL
                            console.log(url);

                            $scope.lihatFileSKL = function () {
                                window.open(url);
                            }
                        })

                        firebase.database().ref('siswa/' + updateID + '/fileDokPrestasi').on('value', function (snapshot) {
                            var data = snapshot.val();
                            var url = data.URL
                            console.log(url);

                            $scope.lihatFilePrestasi = function () {
                                window.open(url);
                            }
                        })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.verifikasi_siswa = function () {

                            var poinPrestasiinput = document.getElementById("poinPrestasi").value
                            console.log(poinPrestasiinput);

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                status_uprove: true,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            var poinPrestasiinput = document.getElementById("poinPrestasi").value
                            console.log(poinPrestasiinput);

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                status_uprove: false,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarPerpindahan', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifPerpindahan").value = values.nisn;
                        document.getElementById("nikVerifPerpindahan").value = values.nik;
                        document.getElementById("namaVerifPerpindahan").value = values.nama;
                        document.getElementById("alamatVerifPerpindahan").value = values.alamatzonasi;
                        document.getElementById("tglLahirVerifPerpindahan").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifPerpindahan").value = values.jarak;
                        document.getElementById("noSKLVerifPerpindahan").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifPerpindahan").value = values.nilai_skl;

                        document.getElementById("sekolahAsalSDPerpindahan").value = values.sekolah_asal;


                        firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                            var data = snapshot.val();
                            var url = data.URL
                            console.log(url);

                            $scope.lihatFileSKL = function () {
                                window.open(url);
                            }
                        })

                        firebase.database().ref('siswa/' + updateID + '/fileDokPerpindahan').on('value', function (snapshot) {
                            var data = snapshot.val();
                            var url = data.URL
                            console.log(url);

                            $scope.lihatFilePerpindahan = function () {
                                window.open(url);
                            }
                        })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.verifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarZonasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifZonasi").value = values.nisn;
                        document.getElementById("nikVerifZonasi").value = values.nik;
                        document.getElementById("namaVerifZonasi").value = values.nama;
                        document.getElementById("alamatsiswaVerifZonasi").value = values.alamat;
                        document.getElementById("alamatVerifZonasi").value = values.alamatzonasi;
                        document.getElementById("sekolahVerifZonasi").value = values.sekolah_asal;
                        document.getElementById("tglLahirVerifZonasi").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifZonasi").value = values.jarak;
                        document.getElementById("noSKLVerifZonasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifZonasi").value = values.nilai_skl;
                        document.getElementById("noKKVerifZonasi").value = values.noKK;
                        document.getElementById("statusKKVerifZonasi").value = values.statusKK;
                        document.getElementById("desaVerifikasiZonasi").value = values.namaDesa;
                        document.getElementById("luarzona").value = values.luarzonasi;


                        if (values.koreksi == undefined) {
                            document.getElementById("koreksiTampil").value = 'Tidak Ada Pesan Koreksi';
                        } else {
                            document.getElementById("koreksiTampil").value = values.koreksi;
                        }
                        console.log(values.uid);

                        var idSD = values.id_sd;
                        var idSMP = values.sekolahZonasiId;


                        $scope.status_daftar = values.status_daftar;
                        console.log($scope.status_daftar);
                        if ($scope.status_daftar == true) {
                            document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        } else {
                            document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        }


                        // firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                        //     var data = snapshot.val();
                        //     var url = data.URL
                        //     console.log(url);
                        //     if (url == null) {
                        //         console("file")
                        //     }

                        //     $scope.lihatFileSKL = function () {
                        //         window.open(url);
                        //     }

                        // })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.simpanAkses = function () {
                            var chekdaftar = document.getElementById("bukadaftar").value;

                            console.log(chekdaftar);

                            if (chekdaftar == 'on') {
                                firebase.database().ref('siswa/' + updateID).update({
                                    status_daftar: false,
                                    status_daftarJalur: false,
                                    status_daftarZonasi: false,
                                    status_skl: false,
                                    status_terima: false,
                                    status_uprove: false,
                                    status_skl: false,
                                });

                                firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                // firebase.database().ref('siswa/'+ updateID + '/file').remove();

                            } else {
                                console.log('TIDAK UPDATE');
                            }
                            // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Siswa Berhasil di Update',
                            })
                            $("#modal_edit-zonasi").modal('hide')
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });

                $('body').on('click', '.updateDataDaftarNull', function () {
                    // updateID = $(this).attr('data-id');
                    updateID = $(this).attr('data-id');
                    window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifZonasiNULL").value = values.nisn;
                        document.getElementById("nikVerifZonasiNULL").value = values.nik;
                        document.getElementById("namaVerifZonasiNULL").value = values.nama;

                        var idSD = values.id_sd;
                        var idSMP = values.sekolahZonasiId;


                        $scope.status_daftar = values.status_daftar;
                        console.log($scope.status_daftar);
                        if ($scope.status_daftar == true) {
                            document.getElementById("chekdaftarNULL").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        } else {
                            document.getElementById("chekdaftarNULL").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        }


                        // firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                        //     var data = snapshot.val();
                        //     var url = data.URL
                        //     console.log(url);
                        //     if (url == null) {
                        //         console("file")
                        //     }

                        //     $scope.lihatFileSKL = function () {
                        //         window.open(url);
                        //     }

                        // })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.simpanAkses = function () {
                            var chekdaftar = document.getElementById("bukadaftar").value;

                            console.log(chekdaftar);

                            if (chekdaftar == 'on') {
                                firebase.database().ref('siswa/' + updateID).update({
                                    status_daftar: false,
                                    status_daftarJalur: false,
                                    status_daftarZonasi: false,
                                    status_skl: false,
                                    status_terima: false,
                                    status_uprove: false,
                                    status_skl: false,
                                });

                                firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                // firebase.database().ref('siswa/'+ updateID + '/file').remove();

                            } else {
                                console.log('TIDAK UPDATE');
                            }
                            // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Siswa Berhasil di Update',
                            })
                            $("#modal_edit-zonasiNULL").modal('hide')
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }

        var ref = firebase.database().ref("siswa").orderByChild('sttsDaftarUlang').equalTo(false);
        var listRef = $firebaseArray(ref);
        $scope.jumlahZonasiTotal = 0;
        $scope.jumlahAfirmasiTotal = 0;
        $scope.jumlahPerpindahanTotal = 0;
        $scope.jumlahPrestasiTotal = 0;

        $scope.jumlahPendaftarBanjar = 0;
        $scope.jumlahPendaftarBuleleng = 0;
        $scope.jumlahPendaftarBusungBiu = 0;
        $scope.jumlahPendaftarGerokgak = 0;
        $scope.jumlahPendaftarKubutambahan = 0;
        $scope.jumlahPendaftarSeririt = 0;
        $scope.jumlahPendaftarSawan = 0;
        $scope.jumlahPendaftarSukasada = 0;
        $scope.jumlahPendaftarTejakula = 0;


        // banjar
        $scope.jumlahZonasiTotalBanjar = 0;
        $scope.jumlahAfirmasiTotalBanjar = 0;
        $scope.jumlahPerpindahanTotalBanjar = 0;
        $scope.jumlahPrestasiTotalBanjar = 0;

        // buleleng
        $scope.jumlahZonasiTotalBuleleng = 0;
        $scope.jumlahAfirmasiTotalBuleleng = 0;
        $scope.jumlahPerpindahanTotalBuleleng = 0;
        $scope.jumlahPrestasiTotalBuleleng = 0;

        // busungbiu
        $scope.jumlahZonasiTotalBusungBiu = 0;
        $scope.jumlahAfirmasiTotalBusungBiu = 0;
        $scope.jumlahPerpindahanTotalBusungBiu = 0;
        $scope.jumlahPrestasiTotalBusungBiu = 0;

        // gerokgak
        $scope.jumlahZonasiTotalGerokgak = 0;
        $scope.jumlahAfirmasiTotalGerokgak = 0;
        $scope.jumlahPerpindahanTotalGerokgak = 0;
        $scope.jumlahPrestasiTotalGerokgak = 0;

        // kubutambahan
        $scope.jumlahZonasiTotalKubutambahan = 0;
        $scope.jumlahAfirmasiTotalKubutambahan = 0;
        $scope.jumlahPerpindahanTotalKubutambahan = 0;
        $scope.jumlahPrestasiTotalKubutambahan = 0;

        // seririt
        $scope.jumlahZonasiTotalSeririt = 0;
        $scope.jumlahAfirmasiTotalSeririt = 0;
        $scope.jumlahPerpindahanTotalSeririt = 0;
        $scope.jumlahPrestasiTotalSeririt = 0;

        // seririt
        $scope.jumlahZonasiTotalSawan = 0;
        $scope.jumlahAfirmasiTotalSawan = 0;
        $scope.jumlahPerpindahanTotalSawan = 0;
        $scope.jumlahPrestasiTotalSawan = 0;

        // sukasada
        $scope.jumlahZonasiTotalSukasada = 0;
        $scope.jumlahAfirmasiTotalSukasada = 0;
        $scope.jumlahPerpindahanTotalSukasada = 0;
        $scope.jumlahPrestasiTotalSukasada = 0;

        // tejakula
        $scope.jumlahZonasiTotalTejakula = 0;
        $scope.jumlahAfirmasiTotalTejakula = 0;
        $scope.jumlahPerpindahanTotalTejakula = 0;
        $scope.jumlahPrestasiTotalTejakula = 0;


        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            // console.log(response[0].jalur2);
            $scope.jumlah_pendaftar_siswa = response.length;
            $scope.pendaftar_siswa = response;
            firebase.database().ref('jumlah').update({
                jumlah_siswaTerdaftar: $scope.jumlah_pendaftar_siswa,
            })
            var jmlPendaftarSpan = parseInt($scope.jumlah_pendaftar_siswa);
            $('#jmlPendaftarSpan').text(jmlPendaftarSpan);

            // PERULANGAN INDEKS
            // for (let index = 0; index < response.length; index++) {
            //     if (response[index].jalur == 'zonasi') {
            //         // console.log('DAFTAR ZONASI')
            //         $scope.jumlahZonasiTotal++;
            //         if (response[index].jalur2 == 'afirmasi') {
            //             $scope.jumlahAfirmasiTotal++;
            //         } else if (response[index].jalur2 == 'perpindahan') {
            //             $scope.jumlahPerpindahanTotal++;
            //         } else if (response[index].jalur2 == 'prestasi') {
            //             $scope.jumlahPrestasiTotal++;
            //         }
            //     } else {
            //         console.log("BELUM SELESAI MENDAFTAR")
            //     }

            // }
            for (let index = 0; index < response.length; index++) {
                if (response[index].idKecamatan == 'id-kecBanjar') {
                    // console.log('Banjar')
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalBanjar++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalBanjar++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalBanjar++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalBanjar++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecBuleleng') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalBuleleng++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalBuleleng++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalBuleleng++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalBuleleng++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecBusungbiu') {
                    console.log('DAFTAR BUSUNGBIU')
                    if (response[index].jalur == 'zonasi') {
                        $scope.jumlahZonasiTotalBusungBiu++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalBusungBiu++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalBusungBiu++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalBusungBiu++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecGerokgak') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalGerokgak++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalGerokgak++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalGerokgak++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalGerokgak++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecKubutambahan') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalKubutambahan++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalKubutambahan++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalKubutambahan++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalKubutambahan++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecSawan') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalSawan++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalSawan++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalSawan++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalSawan++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecSeririt') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalSeririt++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalSeririt++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalSeririt++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalSeririt++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecSukasada') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalSukasada++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalSukasada++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalSukasada++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalSukasada++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                } else if (response[index].idKecamatan == 'id-kecTejakula') {
                    if (response[index].jalur == 'zonasi') {
                        // console.log('DAFTAR ZONASI')
                        $scope.jumlahZonasiTotalTejakula++;
                        if (response[index].jalur2 == 'afirmasi') {
                            $scope.jumlahAfirmasiTotalTejakula++;
                        } else if (response[index].jalur2 == 'perpindahan') {
                            $scope.jumlahPerpindahanTotalTejakula++;
                        } else if (response[index].jalur2 == 'prestasi') {
                            $scope.jumlahPrestasiTotalTejakula++;
                        }
                    } else {
                        // console.log("BELUM SELESAI MENDAFTAR")
                    }
                }
                else {
                    // console.log("BELUM SELESAI MENDAFTAR")
                }

            }
            // UPDATE JUMLAH ZONASI SELURUH
            // console.log($scope.jumlahZonasiTotal);
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaZonasiSeluruh: $scope.jumlahZonasiTotal,
            // })
            // UPDATE JUMLAH AFIRMASI SELURUH
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaAfirmasiSeluruh: $scope.jumlahAfirmasiTotal,
            // })
            // UPDATE JUMLAH PERPINDAHAN SELURUH
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaPerpindahanSeluruh: $scope.jumlahPerpindahanTotal,
            // })
            // UPDATE JUMLAH PRESTASI SELURUH
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaPrestasiSeluruh: $scope.jumlahPrestasiTotal,
            // })

            // Total pendaftar zonasi
            $scope.jumlahZonasiTotal = ($scope.jumlahZonasiTotalBanjar + $scope.jumlahZonasiTotalBuleleng + $scope.jumlahZonasiTotalBusungBiu + $scope.jumlahZonasiTotalGerokgak + $scope.jumlahZonasiTotalKubutambahan + $scope.jumlahZonasiTotalSawan + $scope.jumlahZonasiTotalSeririt + $scope.jumlahZonasiTotalSukasada + $scope.jumlahZonasiTotalTejakula)

            // Total pendaftar afirmasi
            $scope.jumlahAfirmasiTotal = ($scope.jumlahAfirmasiTotalBanjar + $scope.jumlahAfirmasiTotalBuleleng + $scope.jumlahAfirmasiTotalBusungBiu + $scope.jumlahAfirmasiTotalGerokgak + $scope.jumlahAfirmasiTotalKubutambahan + $scope.jumlahAfirmasiTotalSawan + $scope.jumlahAfirmasiTotalSeririt + $scope.jumlahAfirmasiTotalSukasada + $scope.jumlahAfirmasiTotalTejakula)

            // Total pendaftar perpindahan
            $scope.jumlahPerpindahanTotal = ($scope.jumlahPerpindahanTotalBanjar + $scope.jumlahPerpindahanTotalBuleleng + $scope.jumlahPerpindahanTotalBusungBiu + $scope.jumlahPerpindahanTotalGerokgak + $scope.jumlahPerpindahanTotalKubutambahan + $scope.jumlahPerpindahanTotalSawan + $scope.jumlahPerpindahanTotalSeririt + $scope.jumlahPerpindahanTotalSukasada + $scope.jumlahPerpindahanTotalTejakula)

            // Total pendaftar prestasi
            $scope.jumlahPrestasiTotal = ($scope.jumlahPrestasiTotalBanjar + $scope.jumlahPrestasiTotalBuleleng + $scope.jumlahPrestasiTotalBusungBiu + $scope.jumlahPrestasiTotalGerokgak + $scope.jumlahPrestasiTotalKubutambahan + $scope.jumlahPrestasiTotalSawan + $scope.jumlahPrestasiTotalSeririt + $scope.jumlahPrestasiTotalSukasada + $scope.jumlahPrestasiTotalTejakula)


            // total pendaftar perkecamatan
            $scope.jumlahPendaftarBanjar = ($scope.jumlahZonasiTotalBanjar + $scope.jumlahAfirmasiTotalBanjar + $scope.jumlahPerpindahanTotalBanjar + $scope.jumlahPrestasiTotalBanjar)
            console.log('Banjar : ' + $scope.jumlahPendaftarBanjar);
            $scope.jumlahPendaftarBuleleng = ($scope.jumlahZonasiTotalBuleleng + $scope.jumlahAfirmasiTotalBuleleng + $scope.jumlahPerpindahanTotalBuleleng + $scope.jumlahPrestasiTotalBuleleng)
            console.log('Buleleng : ' + $scope.jumlahPendaftarBuleleng);
            $scope.jumlahPendaftarBusungBiu = ($scope.jumlahZonasiTotalBusungBiu + $scope.jumlahAfirmasiTotalBusungBiu + $scope.jumlahPerpindahanTotalBusungBiu + $scope.jumlahPrestasiTotalBusungBiu)
            console.log('BusungBiu : ' + $scope.jumlahPendaftarBusungBiu);
            $scope.jumlahPendaftarGerokgak = ($scope.jumlahZonasiTotalGerokgak + $scope.jumlahAfirmasiTotalGerokgak + $scope.jumlahPerpindahanTotalGerokgak + $scope.jumlahPrestasiTotalGerokgak)
            console.log('Gerokgak : ' + $scope.jumlahPendaftarGerokgak);
            $scope.jumlahPendaftarKubutambahan = ($scope.jumlahZonasiTotalKubutambahan + $scope.jumlahAfirmasiTotalKubutambahan + $scope.jumlahPerpindahanTotalKubutambahan + $scope.jumlahPrestasiTotalKubutambahan)
            console.log('Kubutambahan : ' + $scope.jumlahPendaftarKubutambahan);
            $scope.jumlahPendaftarSawan = ($scope.jumlahZonasiTotalSawan + $scope.jumlahAfirmasiTotalSawan + $scope.jumlahPerpindahanTotalSawan + $scope.jumlahPrestasiTotalSawan)
            console.log('Sawan : ' + $scope.jumlahPendaftarSawan);
            $scope.jumlahPendaftarSeririt = ($scope.jumlahZonasiTotalSeririt + $scope.jumlahAfirmasiTotalSeririt + $scope.jumlahPerpindahanTotalSeririt + $scope.jumlahPrestasiTotalSeririt)
            console.log('Seririt : ' + $scope.jumlahPendaftarSeririt);
            $scope.jumlahPendaftarSukasada = ($scope.jumlahZonasiTotalSukasada + $scope.jumlahAfirmasiTotalSukasada + $scope.jumlahPerpindahanTotalSukasada + $scope.jumlahPrestasiTotalSukasada)
            console.log('Sukasada : ' + $scope.jumlahPendaftarSukasada);
            $scope.jumlahPendaftarTejakula = ($scope.jumlahZonasiTotalTejakula + $scope.jumlahAfirmasiTotalTejakula + $scope.jumlahPerpindahanTotalTejakula + $scope.jumlahPrestasiTotalTejakula)
            console.log('Tejakula : ' + $scope.jumlahPendaftarTejakula);

            // UPDATE JUMLAH ZONASI SELURUH
            firebase.database().ref('jumlah').update({
                jumlah_siswaZonasiSeluruh: $scope.jumlahZonasiTotal,
                jumlah_siswaAfirmasiSeluruh: $scope.jumlahAfirmasiTotal,
                jumlah_siswaPerpindahanSeluruh: $scope.jumlahPerpindahanTotal,
                jumlah_siswaPrestasiSeluruh: $scope.jumlahPrestasiTotal,

                // Banjar
                jumlah_siswaTerdaftarBanjar: $scope.jumlahPendaftarBanjar,
                jumlah_siswaZonasiSeluruhBanjar: $scope.jumlahZonasiTotalBanjar,
                jumlah_siswaAfirmasiSeluruhBanjar: $scope.jumlahAfirmasiTotalBanjar,
                jumlah_siswaPerpindahanSeluruhBanjar: $scope.jumlahPerpindahanTotalBanjar,
                jumlah_siswaPrestasiSeluruhBanjar: $scope.jumlahPrestasiTotalBanjar,

                // Buleleng
                jumlah_siswaTerdaftarBuleleng: $scope.jumlahPendaftarBuleleng,
                jumlah_siswaZonasiSeluruhBuleleng: $scope.jumlahZonasiTotalBuleleng,
                jumlah_siswaAfirmasiSeluruhBuleleng: $scope.jumlahAfirmasiTotalBuleleng,
                jumlah_siswaPerpindahanSeluruhBuleleng: $scope.jumlahPerpindahanTotalBuleleng,
                jumlah_siswaPrestasiSeluruhBuleleng: $scope.jumlahPrestasiTotalBuleleng,

                // Busungbiu
                jumlah_siswaTerdaftarBusungBiu: $scope.jumlahPendaftarBusungBiu,
                jumlah_siswaZonasiSeluruhBusungBiu: $scope.jumlahZonasiTotalBusungBiu,
                jumlah_siswaAfirmasiSeluruhBusungBiu: $scope.jumlahAfirmasiTotalBusungBiu,
                jumlah_siswaPerpindahanSeluruhBusungBiu: $scope.jumlahPerpindahanTotalBusungBiu,
                jumlah_siswaPrestasiSeluruhBusungBiu: $scope.jumlahPrestasiTotalBusungBiu,

                // Gerokgak
                jumlah_siswaTerdaftarGerokgak: $scope.jumlahPendaftarGerokgak,
                jumlah_siswaZonasiSeluruhGerokgak: $scope.jumlahZonasiTotalGerokgak,
                jumlah_siswaAfirmasiSeluruhGerokgak: $scope.jumlahAfirmasiTotalGerokgak,
                jumlah_siswaPerpindahanSeluruhGerokgak: $scope.jumlahPerpindahanTotalGerokgak,
                jumlah_siswaPrestasiSeluruhGerokgak: $scope.jumlahPrestasiTotalGerokgak,

                // Kubutambahan
                jumlah_siswaTerdaftarKubutambahan: $scope.jumlahPendaftarKubutambahan,
                jumlah_siswaZonasiSeluruhKubutambahan: $scope.jumlahZonasiTotalKubutambahan,
                jumlah_siswaAfirmasiSeluruhKubutambahan: $scope.jumlahAfirmasiTotalKubutambahan,
                jumlah_siswaPerpindahanSeluruhKubutambahan: $scope.jumlahPerpindahanTotalKubutambahan,
                jumlah_siswaPrestasiSeluruhKubutambahan: $scope.jumlahPrestasiTotalKubutambahan,

                // Sawan
                jumlah_siswaTerdaftarSawan: $scope.jumlahPendaftarSawan,
                jumlah_siswaZonasiSeluruhSawan: $scope.jumlahZonasiTotalSawan,
                jumlah_siswaAfirmasiSeluruhSawan: $scope.jumlahAfirmasiTotalSawan,
                jumlah_siswaPerpindahanSeluruhSawan: $scope.jumlahPerpindahanTotalSawan,
                jumlah_siswaPrestasiSeluruhSawan: $scope.jumlahPrestasiTotalSawan,

                // Seririt
                jumlah_siswaTerdaftarSeririt: $scope.jumlahPendaftarSeririt,
                jumlah_siswaZonasiSeluruhSeririt: $scope.jumlahZonasiTotalSeririt,
                jumlah_siswaAfirmasiSeluruhSeririt: $scope.jumlahAfirmasiTotalSeririt,
                jumlah_siswaPerpindahanSeluruhSeririt: $scope.jumlahPerpindahanTotalSeririt,
                jumlah_siswaPrestasiSeluruhSeririt: $scope.jumlahPrestasiTotalSeririt,

                // Sukasada
                jumlah_siswaTerdaftarSukasada: $scope.jumlahPendaftarSukasada,
                jumlah_siswaZonasiSeluruhSukasada: $scope.jumlahZonasiTotalSukasada,
                jumlah_siswaAfirmasiSeluruhSukasada: $scope.jumlahAfirmasiTotalSukasada,
                jumlah_siswaPerpindahanSeluruhSukasada: $scope.jumlahPerpindahanTotalSukasada,
                jumlah_siswaPrestasiSeluruhSukasada: $scope.jumlahPrestasiTotalSukasada,

                // Tejakula
                jumlah_siswaTerdaftarTejakula: $scope.jumlahPendaftarTejakula,
                jumlah_siswaZonasiSeluruhTejakula: $scope.jumlahZonasiTotalTejakula,
                jumlah_siswaAfirmasiSeluruhTejakula: $scope.jumlahAfirmasiTotalTejakula,
                jumlah_siswaPerpindahanSeluruhTejakula: $scope.jumlahPerpindahanTotalTejakula,
                jumlah_siswaPrestasiSeluruhTejakula: $scope.jumlahPrestasiTotalTejakula,
            })
            // // UPDATE JUMLAH AFIRMASI SELURUH
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaAfirmasiSeluruh: $scope.jumlahAfirmasiTotal,
            // })
            // // UPDATE JUMLAH PERPINDAHAN SELURUH
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaPerpindahanSeluruh: $scope.jumlahPerpindahanTotal,
            // })
            // // UPDATE JUMLAH PRESTASI SELURUH
            // firebase.database().ref('jumlah').update({
            //     jumlah_siswaPrestasiSeluruh: $scope.jumlahPrestasiTotal,
            // })




        })

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])



    .controller('dataPendaftarSMPAdminSuperZonasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;

        // function nightActive()  {
        //     if (document.getElementById('nightmode').classList.contains('night-active')) {

        //         $('#icon-night').addClass('fa-moon text-light').removeClass('fa-sun');
        //         $("#nav-flex").addClass('bg-night-side').removeClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-night').removeClass('bg-light');
        //         $("#menu-toggle, .nav-link").addClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").addClass('text-light').removeClass('text-dark');
        //         $("#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
        //         $("li.montserrat").addClass('bg-night-side text-light');
        //         $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');

        //     } else {

        //         $('#icon-night').addClass('fa-sun').removeClass('fa-moon text-light');
        //         $("#nav-flex").removeClass('bg-night-side').addClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-light').removeClass('bg-night');
        //         $("#menu-toggle, .nav-link").removeClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").removeClass('text-light').addClass('text-dark');
        //         $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
        //         $("li.montserrat").removeClass('bg-night-side text-light');
        //         $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
        //     }
        // };
        //     $("#nightmode").toggleClass(window.localStorage.nightActive);
        //     console.log(window.localStorage.nightActive)

        //     nightActive();
        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        // $scope.nightmode = function () {
        //     if (window.localStorage.nightActive != "night-active") {
        //         $('#nightmode').toggleClass("night-active", true);
        //         window.localStorage.nightActive = "night-active";

        //     } else {
        //         $('#nightmode').toggleClass("night-active", false);
        //         window.localStorage.nightActive = "";
        //     }
        //     nightActive();
        // }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }


        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftar', function () {
                    updateID = $(this).attr('data-id');
                    $('#modal_edit').modal('hide');
                    $state.go('dataPendaftarSMPAdminSuper', {
                        "idSekolah": updateID,
                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_smp = response.length;
            $scope.sekolah_smp = response;

        })

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuper');
        }
        $scope.data_pendaftarMenu = function () {
            $state.go('dataPendaftarAdminSuperMenu');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])
    .controller('dataPendaftarSMPAdminSuperAfirmasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;

        // function nightActive()  {
        //     if (document.getElementById('nightmode').classList.contains('night-active')) {

        //         $('#icon-night').addClass('fa-moon text-light').removeClass('fa-sun');
        //         $("#nav-flex").addClass('bg-night-side').removeClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-night').removeClass('bg-light');
        //         $("#menu-toggle, .nav-link").addClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").addClass('text-light').removeClass('text-dark');
        //         $("#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
        //         $("li.montserrat").addClass('bg-night-side text-light');
        //         $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');

        //     } else {

        //         $('#icon-night').addClass('fa-sun').removeClass('fa-moon text-light');
        //         $("#nav-flex").removeClass('bg-night-side').addClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-light').removeClass('bg-night');
        //         $("#menu-toggle, .nav-link").removeClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").removeClass('text-light').addClass('text-dark');
        //         $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
        //         $("li.montserrat").removeClass('bg-night-side text-light');
        //         $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
        //     }
        // };
        //     $("#nightmode").toggleClass(window.localStorage.nightActive);
        //     console.log(window.localStorage.nightActive)

        //     nightActive();
        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        // $scope.nightmode = function () {
        //     if (window.localStorage.nightActive != "night-active") {
        //         $('#nightmode').toggleClass("night-active", true);
        //         window.localStorage.nightActive = "night-active";

        //     } else {
        //         $('#nightmode').toggleClass("night-active", false);
        //         window.localStorage.nightActive = "";
        //     }
        //     nightActive();
        // }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }


        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftar', function () {
                    updateID = $(this).attr('data-id');
                    $('#modal_edit').modal('hide');
                    $state.go('dataPendaftarSMPAdminSuper', {
                        "idSekolah": updateID,
                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_smp = response.length;
            $scope.sekolah_smp = response;

        })

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])
    .controller('dataPendaftarSMPAdminSuperPerpindahanCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;

        // function nightActive()  {
        //     if (document.getElementById('nightmode').classList.contains('night-active')) {

        //         $('#icon-night').addClass('fa-moon text-light').removeClass('fa-sun');
        //         $("#nav-flex").addClass('bg-night-side').removeClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-night').removeClass('bg-light');
        //         $("#menu-toggle, .nav-link").addClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").addClass('text-light').removeClass('text-dark');
        //         $("#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
        //         $("li.montserrat").addClass('bg-night-side text-light');
        //         $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');

        //     } else {

        //         $('#icon-night').addClass('fa-sun').removeClass('fa-moon text-light');
        //         $("#nav-flex").removeClass('bg-night-side').addClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-light').removeClass('bg-night');
        //         $("#menu-toggle, .nav-link").removeClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").removeClass('text-light').addClass('text-dark');
        //         $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
        //         $("li.montserrat").removeClass('bg-night-side text-light');
        //         $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
        //     }
        // };
        //     $("#nightmode").toggleClass(window.localStorage.nightActive);
        //     console.log(window.localStorage.nightActive)

        //     nightActive();
        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        // $scope.nightmode = function () {
        //     if (window.localStorage.nightActive != "night-active") {
        //         $('#nightmode').toggleClass("night-active", true);
        //         window.localStorage.nightActive = "night-active";

        //     } else {
        //         $('#nightmode').toggleClass("night-active", false);
        //         window.localStorage.nightActive = "";
        //     }
        //     nightActive();
        // }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }


        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftar', function () {
                    updateID = $(this).attr('data-id');
                    $('#modal_edit').modal('hide');
                    $state.go('dataPendaftarSMPAdminSuper', {
                        "idSekolah": updateID,
                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_smp = response.length;
            $scope.sekolah_smp = response;

        })

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])
    .controller('dataPendaftarSMPAdminSuperPrestasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;

        // function nightActive()  {
        //     if (document.getElementById('nightmode').classList.contains('night-active')) {

        //         $('#icon-night').addClass('fa-moon text-light').removeClass('fa-sun');
        //         $("#nav-flex").addClass('bg-night-side').removeClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-night').removeClass('bg-light');
        //         $("#menu-toggle, .nav-link").addClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").addClass('text-light').removeClass('text-dark');
        //         $("#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
        //         $("li.montserrat").addClass('bg-night-side text-light');
        //         $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');

        //     } else {

        //         $('#icon-night').addClass('fa-sun').removeClass('fa-moon text-light');
        //         $("#nav-flex").removeClass('bg-night-side').addClass('bck');
        //         $("#wrapper, .navbar").addClass('bg-light').removeClass('bg-night');
        //         $("#menu-toggle, .nav-link").removeClass('text-light');
        //         $(".fa-question-circle, span.fw-light,  th, td, label").removeClass('text-light').addClass('text-dark');
        //         $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
        //         $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

        //         $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
        //         $("li.montserrat").removeClass('bg-night-side text-light');
        //         $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
        //     }
        // };
        //     $("#nightmode").toggleClass(window.localStorage.nightActive);
        //     console.log(window.localStorage.nightActive)

        //     nightActive();
        $scope.toogle = function () {
            $('#wrapper').toggleClass("toggled");
        }
        // $scope.nightmode = function () {
        //     if (window.localStorage.nightActive != "night-active") {
        //         $('#nightmode').toggleClass("night-active", true);
        //         window.localStorage.nightActive = "night-active";

        //     } else {
        //         $('#nightmode').toggleClass("night-active", false);
        //         window.localStorage.nightActive = "";
        //     }
        //     nightActive();
        // }
        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
        }


        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_super');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_super').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                };

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })

                $scope.logout = function () {
                    // $("#modal_keluar").modal('hide')
                    const swalLogout = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalLogout.fire({
                        title: 'Log out',
                        icon: 'warning',
                        text: 'Apakah Anda Yakin Ingin Keluar Aplikasi ?',
                        showCancelButton: true,
                        confirmButtonText: 'Keluar',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.auth().signOut();
                        }
                    })

                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftar', function () {
                    updateID = $(this).attr('data-id');
                    $('#modal_edit').modal('hide');
                    $state.go('dataPendaftarSMPAdminSuper', {
                        "idSekolah": updateID,
                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_smp = response.length;
            $scope.sekolah_smp = response;

        })

        $scope.beranda = function () {
            $state.go('berandaAdminSuper');
        }
        $scope.data_admin = function () {
            $state.go('dataAdmin');
        }

        $scope.data_sekolah = function () {
            $state.go('dataSekolah');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswa');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])

