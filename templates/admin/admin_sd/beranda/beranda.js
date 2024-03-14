angular.module('app.brndAdminSd', [])

    .controller('berandaAdminSdCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        var cekBukaPPDB = firebase.database().ref('pengaturan').child('buka_ppdb');
        cekBukaPPDB.on('value', (dataSnapShot) => {
            $scope.cekBukaPPDB = dataSnapShot.val().aktif;
            console.log($scope.cekBukaPPDB);
            if ($scope.cekBukaPPDB == true) {
                console.log('PENDAFTARAN DIBUKA')
            } else {
                firebase.auth().signOut();
            }
        })


        var userID = $stateParams.idUser;
        $ionicLoading.show();
        
        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light').removeClass('bg-light');
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light').addClass('bg-light');
                $("#menu-toggle, .nav-link").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
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
                // list pembagian wilayah sekolah per desa
                var ref = firebase.database().ref("desa");
                var listRef = $firebaseArray(ref);
        
                $ionicLoading.show();
                listRef.$loaded().then(function (response) {
                    $ionicLoading.hide();
                    $scope.wilayah_desa = response;
        
                })
                // remove string di tabel pembagian wilayah 
                $scope.removestring = function () {
                    var tds = document.getElementsByTagName('td');
                    for (var i = 0; i < tds.length; i++) {
        
                        if (tds[i].innerHTML.includes('id-desa')) {
                            tds[i].innerHTML = tds[i].innerHTML.replace(/id-desa/g, "")
                            tds[i].innerHTML = tds[i].innerHTML.replace(/([A-Z])/g, ' $1').trim()
                        }
        
        
                    }
                }
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_sd');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sd').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    // "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "sekolah": dataSnapShot.val().sekolah,
                                };

                                $scope.npsn = dataSnapShot.val().npsn;
                                if ($scope.npsn == '50100100' || $scope.npsn == '50100153' || $scope.npsn == '50100101' ) {
                                    $scope.penerimaanSD = true;
                                }else{
                                    $scope.penerimaanSD = false;
                                }

                            })
                        });
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })
                // Notifikasi
                var ref = firebase.database().ref("notifikasi").orderByChild('penerima').equalTo(String('SD'));
                var listRef = $firebaseArray(ref);

                listRef.$loaded().then(function (response) {
                    console.log(response);
                    $scope.notifikasi = response;
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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.beranda = function () {
            $state.go('berandaAdminSd');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswaSd');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSd');
        }

        $scope.siswa_terdaftar = function () {
            $state.go('dataSiswaterdaftarSd');
        }
        $scope.siswa_diterima = function () {
            $state.go('dataSiswaDiterimaSd');
        }



    }])