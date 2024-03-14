angular.module('app.brndAdminSuper', [])

    .controller('berandaAdminSuperCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        // window.location.reload();
        // var userID = $stateParams.idUser;


        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex").addClass('bg-night').removeClass('bg-light');
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
            } else {
                $("#wrapper, .navbar, #nav-flex").addClass('bg-light').removeClass('bg-night');
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

                let firebaseRefKey = firebase.database().ref('jumlah');
                firebaseRefKey.on('value', (dataSnapShot) => {
                    $scope.formJumlah = {
                        // "nip": dataSnapShot.val().nip,
                        "jumlah_siswa": dataSnapShot.val().jumlah_siswa,
                        "jumlah_siswaLuarRayon": dataSnapShot.val().jumlah_siswaLuarRayon,
                        "jumlah_admin": dataSnapShot.val().jumlah_admin,
                        "jumlah_siswaTerdaftar": dataSnapShot.val().jumlah_siswaTerdaftar,
                        "jumlah_siswaBelumDaftar": dataSnapShot.val().jumlah_siswaBelumDaftar,
                        "jumlah_siswaZonasiSeluruh": dataSnapShot.val().jumlah_siswaZonasiSeluruh,
                        "jumlah_siswaAfirmasiSeluruh": dataSnapShot.val().jumlah_siswaAfirmasiSeluruh,
                        "jumlah_siswaPerpindahanSeluruh": dataSnapShot.val().jumlah_siswaPerpindahanSeluruh,
                        "jumlah_siswaPrestasiSeluruh": dataSnapShot.val().jumlah_siswaPrestasiSeluruh,

                        // banjar
                        "jumlah_siswaTerdaftarBanjar": dataSnapShot.val().jumlah_siswaTerdaftarBanjar,
                        "jumlah_siswaZonasiSeluruhBanjar": dataSnapShot.val().jumlah_siswaZonasiSeluruhBanjar,
                        "jumlah_siswaAfirmasiSeluruhBanjar": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhBanjar,
                        "jumlah_siswaPerpindahanSeluruhBanjar": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhBanjar,
                        "jumlah_siswaPrestasiSeluruhBanjar": dataSnapShot.val().jumlah_siswaPrestasiSeluruhBanjar,

                        // buleleng
                        "jumlah_siswaTerdaftarBuleleng": dataSnapShot.val().jumlah_siswaTerdaftarBuleleng,
                        "jumlah_siswaZonasiSeluruhBuleleng": dataSnapShot.val().jumlah_siswaZonasiSeluruhBuleleng,
                        "jumlah_siswaAfirmasiSeluruhBuleleng": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhBuleleng,
                        "jumlah_siswaPerpindahanSeluruhBuleleng": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhBuleleng,
                        "jumlah_siswaPrestasiSeluruhBuleleng": dataSnapShot.val().jumlah_siswaPrestasiSeluruhBuleleng,

                        // busungbiu
                        "jumlah_siswaTerdaftarBusungBiu": dataSnapShot.val().jumlah_siswaTerdaftarBusungBiu,
                        "jumlah_siswaZonasiSeluruhBusungBiu": dataSnapShot.val().jumlah_siswaZonasiSeluruhBusungBiu,
                        "jumlah_siswaAfirmasiSeluruhBusungBiu": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhBusungBiu,
                        "jumlah_siswaPerpindahanSeluruhBusungBiu": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhBusungBiu,
                        "jumlah_siswaPrestasiSeluruhBusungBiu": dataSnapShot.val().jumlah_siswaPrestasiSeluruhBusungBiu,

                        // gerokgak
                        "jumlah_siswaTerdaftarGerokgak": dataSnapShot.val().jumlah_siswaTerdaftarGerokgak,
                        "jumlah_siswaZonasiSeluruhGerokgak": dataSnapShot.val().jumlah_siswaZonasiSeluruhGerokgak,
                        "jumlah_siswaAfirmasiSeluruhGerokgak": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhGerokgak,
                        "jumlah_siswaPerpindahanSeluruhGerokgak": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhGerokgak,
                        "jumlah_siswaPrestasiSeluruhGerokgak": dataSnapShot.val().jumlah_siswaPrestasiSeluruhGerokgak,

                        // kubutambahan
                        "jumlah_siswaTerdaftarKubutambahan": dataSnapShot.val().jumlah_siswaTerdaftarKubutambahan,
                        "jumlah_siswaZonasiSeluruhKubutambahan": dataSnapShot.val().jumlah_siswaZonasiSeluruhKubutambahan,
                        "jumlah_siswaAfirmasiSeluruhKubutambahan": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhKubutambahan,
                        "jumlah_siswaPerpindahanSeluruhKubutambahan": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhKubutambahan,
                        "jumlah_siswaPrestasiSeluruhKubutambahan": dataSnapShot.val().jumlah_siswaPrestasiSeluruhKubutambahan,

                        // sawan
                        "jumlah_siswaTerdaftarSawan": dataSnapShot.val().jumlah_siswaTerdaftarSawan,
                        "jumlah_siswaZonasiSeluruhSawan": dataSnapShot.val().jumlah_siswaZonasiSeluruhSawan,
                        "jumlah_siswaAfirmasiSeluruhSawan": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhSawan,
                        "jumlah_siswaPerpindahanSeluruhSawan": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhSawan,
                        "jumlah_siswaPrestasiSeluruhSawan": dataSnapShot.val().jumlah_siswaPrestasiSeluruhSawan,

                        // seririt
                        "jumlah_siswaTerdaftarSeririt": dataSnapShot.val().jumlah_siswaTerdaftarSeririt,
                        "jumlah_siswaZonasiSeluruhSeririt": dataSnapShot.val().jumlah_siswaZonasiSeluruhSeririt,
                        "jumlah_siswaAfirmasiSeluruhSeririt": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhSeririt,
                        "jumlah_siswaPerpindahanSeluruhSeririt": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhSeririt,
                        "jumlah_siswaPrestasiSeluruhSeririt": dataSnapShot.val().jumlah_siswaPrestasiSeluruhSeririt,

                        // sukasada
                        "jumlah_siswaTerdaftarSukasada": dataSnapShot.val().jumlah_siswaTerdaftarSukasada,
                        "jumlah_siswaZonasiSeluruhSukasada": dataSnapShot.val().jumlah_siswaZonasiSeluruhSukasada,
                        "jumlah_siswaAfirmasiSeluruhSukasada": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhSukasada,
                        "jumlah_siswaPerpindahanSeluruhSukasada": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhSukasada,
                        "jumlah_siswaPrestasiSeluruhSukasada": dataSnapShot.val().jumlah_siswaPrestasiSeluruhSukasada,

                        // tejakula
                        "jumlah_siswaTerdaftarTejakula": dataSnapShot.val().jumlah_siswaTerdaftarTejakula,
                        "jumlah_siswaZonasiSeluruhTejakula": dataSnapShot.val().jumlah_siswaZonasiSeluruhTejakula,
                        "jumlah_siswaAfirmasiSeluruhTejakula": dataSnapShot.val().jumlah_siswaAfirmasiSeluruhTejakula,
                        "jumlah_siswaPerpindahanSeluruhTejakula": dataSnapShot.val().jumlah_siswaPerpindahanSeluruhTejakula,
                        "jumlah_siswaPrestasiSeluruhTejakula": dataSnapShot.val().jumlah_siswaPrestasiSeluruhTejakula,

                    };
                    console.log($scope.formJumlah.jumlah_siswaTerdaftarBuleleng)
                    console.log($scope.formJumlah.jumlah_siswaZonasiSeluruhBuleleng)
                    console.log($scope.formJumlah.jumlah_siswaAfirmasiSeluruhBuleleng)
                    console.log($scope.formJumlah.jumlah_siswaPerpindahanSeluruhBuleleng)
                    console.log($scope.formJumlah.jumlah_siswaPrestasiSeluruhBuleleng)
                    var jumlah_siswaBelumDaftar = parseInt($scope.formJumlah.jumlah_siswa) - parseInt($scope.formJumlah.jumlah_siswaTerdaftar);
                    firebase.database().ref('jumlah').update({
                        jumlah_siswaBelumDaftar: jumlah_siswaBelumDaftar,
                    })

                    var ctx = document.getElementById('chart-pendaftar').getContext('2d');
                    var ctx2 = document.getElementById('chart-jalur').getContext('2d');
                    var ctx3 = document.getElementById('chart-persebaran-kecamatan').getContext('2d');
                    var ctx4 = document.getElementById('chart-perjalur-kecamatan-banjar').getContext('2d');
                    var ctx5 = document.getElementById('chart-perjalur-kecamatan-buleleng').getContext('2d');
                    var ctx6 = document.getElementById('chart-perjalur-kecamatan-busungbiu').getContext('2d');
                    var ctx7 = document.getElementById('chart-perjalur-kecamatan-gerokgak').getContext('2d');
                    var ctx8 = document.getElementById('chart-perjalur-kecamatan-kubutambahan').getContext('2d');
                    var ctx9 = document.getElementById('chart-perjalur-kecamatan-sawan').getContext('2d');
                    var ctx10 = document.getElementById('chart-perjalur-kecamatan-seririt').getContext('2d');
                    var ctx11 = document.getElementById('chart-perjalur-kecamatan-sukasada').getContext('2d');
                    var ctx12 = document.getElementById('chart-perjalur-kecamatan-tejakula').getContext('2d');

                    var chart_pendaftar = new Chart(ctx, {
                        type: 'pie',
                        data: {
                            labels: ['Belum Mendaftar', 'Terdaftar'],
                            datasets: [{
                                data: [parseInt($scope.formJumlah.jumlah_siswaBelumDaftar), parseInt($scope.formJumlah.jumlah_siswaTerdaftar)],
                                backgroundColor: [
                                    'rgba(220,53,69, 1)',
                                    'rgba(25,135,84, 1)',
                                ],
                                borderColor: [
                                    'rgba(220,53,69, 1)',
                                    'rgba(25,135,84, 1)',
                                ],
                                borderWidth: 1,
                                hoverOffset: 4
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                            },

                        }
                    });
                    var chart_jalur = new Chart(ctx2, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruh), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruh), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruh), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruh)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },
                        }
                    });
                    var chart_persebaran_kecamatan = new Chart(ctx3, {
                        type: 'bar',
                        data: {
                            labels: ['Banjar', 'Buleleng', 'Busung Biu', 'Gerokgak', 'Kubutambahan', 'Sawan', 'Seririt', 'Sukasada', 'Tejakula'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaTerdaftarBanjar), parseInt($scope.formJumlah.jumlah_siswaTerdaftarBuleleng), parseInt($scope.formJumlah.jumlah_siswaTerdaftarBusungBiu), parseInt($scope.formJumlah.jumlah_siswaTerdaftarGerokgak), parseInt($scope.formJumlah.jumlah_siswaTerdaftarKubutambahan), parseInt($scope.formJumlah.jumlah_siswaTerdaftarSawan), parseInt($scope.formJumlah.jumlah_siswaTerdaftarSeririt), parseInt($scope.formJumlah.jumlah_siswaTerdaftarSukasada), parseInt($scope.formJumlah.jumlah_siswaTerdaftarTejakula)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_banjar = new Chart(ctx4, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhBanjar), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhBanjar), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhBanjar), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhBanjar)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_buleleng = new Chart(ctx5, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhBuleleng), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhBuleleng), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhBuleleng), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhBuleleng)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_busungbiu = new Chart(ctx6, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhBusungBiu), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhBusungBiu), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhBusungBiu), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhBusungBiu)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_gerokgak = new Chart(ctx7, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhGerokgak), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhGerokgak), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhGerokgak), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhGerokgak)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_kubutambahan = new Chart(ctx8, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhKubutambahan), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhKubutambahan), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhKubutambahan), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhKubutambahan)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_sawan = new Chart(ctx9, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhSawan), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhSawan), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhSawan), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhSawan)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_seririt = new Chart(ctx10, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhSeririt), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhSeririt), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhSeririt), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhSeririt)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_sukasada = new Chart(ctx11, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhSukasada), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhSukasada), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhSukasada), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhSukasada)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });
                    var chart_perjalur_kecamatan_tejakula = new Chart(ctx12, {
                        type: 'bar',
                        data: {
                            labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                            datasets: [{
                                label: '',
                                data: [parseInt($scope.formJumlah.jumlah_siswaZonasiSeluruhTejakula), parseInt($scope.formJumlah.jumlah_siswaAfirmasiSeluruhTejakula), parseInt($scope.formJumlah.jumlah_siswaPerpindahanSeluruhTejakula), parseInt($scope.formJumlah.jumlah_siswaPrestasiSeluruhTejakula)],
                                backgroundColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(245, 139, 0, 1)',
                                ],
                                borderColor: [
                                    'rgba(13,110,253, 1)',
                                    'rgba(25,135,84, 1)',
                                    'rgba(220,53,69, 1)',
                                    'rgba(255,193,7, 1)',
                                ],
                                borderWidth: 1,
                            }]
                        },
                        plugins: [ChartDataLabels],
                        options: {
                            scales: {
                                y: {
                                    beginAtZero: true
                                }
                            },
                            plugins: {
                                datalabels: {
                                    color: '#ffff'
                                },
                                legend: {
                                    display: false
                                }
                            },

                        }
                    });





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
            $state.go('berandaAdminSuper');
        }
        $scope.lihat = function () {
            $state.go('dataperjalur');
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

        $scope.data_siswaBelumDaftar = function () {
            $state.go('dataSiswaBelumDaftar');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        },

            $scope.perangkinganZonasi = function () {
                $state.go('dataRankingSeluruhZonasi');
            },

            $scope.perangkinganJalur = function () {
                $state.go('dataRankingSeluruhJalur');
            },
            $scope.data_pendaftar = function () {
                $state.go('dataPendaftarAdminSuperMenu');

            }
        $scope.showJadwalPendaftaran = function () {

            var x = document.getElementById("jadwal-pendaftaran");
            var y = document.getElementById("jadwal-perankingan");
            var z = document.getElementById("jadwal-pengumuman");
            if (x.style.display === "block") {
                // x.style.display = "none";
                $('#btn-show-pendaftaran').addClass('on');
                $('#btn-show-perankingan').removeClass('on');
                $('#btn-show-pengumuman').removeClass('on');
            }
            else {
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
                $('#btn-show-pendaftaran').addClass('on');
                $('#btn-show-perankingan').removeClass('on');
                $('#btn-show-pengumuman').removeClass('on');
            }
        }

        $scope.showJadwalPerankingan = function () {
            var x = document.getElementById("jadwal-pendaftaran");
            var y = document.getElementById("jadwal-perankingan");
            var z = document.getElementById("jadwal-pengumuman");
            if (y.style.display === "none") {
                y.style.display = "block";
                $('#btn-show-perankingan').addClass('on');
                x.style.display = "none";
                $('#btn-show-pengumuman').removeClass('on');
                z.style.display = "none";
                $('#btn-show-pendaftaran').removeClass('on');
            }
            else {
                // y.style.display = "none";
            }
        }
        $scope.showJadwalPengumuman = function () {
            var x = document.getElementById("jadwal-pendaftaran");
            var y = document.getElementById("jadwal-perankingan");
            var z = document.getElementById("jadwal-pengumuman");
            if (z.style.display === "none") {
                z.style.display = "block";
                $('#btn-show-pengumuman').addClass('on');
                y.style.display = "none";
                $('#btn-show-perankingan').removeClass('on');
                x.style.display = "none";
                $('#btn-show-pendaftaran').removeClass('on');
            }
            else {

            }

        }

        $scope.form = {
            "idKecamatan": "",
            "idDesa": "",
        }

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
        // var refDesa = firebase.database().ref("desa");
        // $scope.dataDesa = $firebaseArray(refDesa);

        $scope.getIdDesa = function () {
            var idDesa = $scope.form.idDesa;
            $scope.idDesa = $scope.form.idDesa;
            //Get Nama Kecamatan
            var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
            var listNamaDesa = $firebaseArray(namaDesa);
            listNamaDesa.$loaded().then(function (response) {
                $scope.namaDesa = response[0].nama_desa;
                $scope.id_desa = response[0].id_desa;


                $scope.sklhNama1 = response[0].nama_smp;
                $scope.sklhId1 = response[0].id_smp;
                $scope.sklhAlamat1 = response[0].alamat_smp;

                // $scope.sklhNama2 = response[0].nama_smp2;
                // $scope.sklhId2 = response[0].id_smp2;
                // $scope.sklhAlamat2 = response[0].alamat_smp2;

                // $scope.sklhNama3 = response[0].nama_smp3;
                // $scope.sklhId3 = response[0].id_smp3;
                // $scope.sklhAlamat3 = response[0].alamat_smp3;

                // $scope.sklhNama4 = response[0].nama_smp4;
                // $scope.sklhId4 = response[0].id_smp4;
                // $scope.sklhAlamat4 = response[0].alamat_smp4;

                // $scope.sklhNama5 = response[0].nama_smp5;
                // $scope.sklhId5 = response[0].id_smp5;
                // $scope.sklhAlamat5 = response[0].alamat_smp5;

            });

        }
        $scope.simpanTambahDataSiswa = function () {
            var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
            var namaSiswa = document.getElementById("namaSiswa").value;
            var AlamatSiswa = document.getElementById("AlamatSiswa").value;
            var npsnSiswa = document.getElementById("npsnSiswa").value;
            var NikSiswa = document.getElementById("nikSiswa").value;
            var nisnSiswa = document.getElementById("nisnSiswa").value;
            var SekolahSiswa = document.getElementById("sekolahSiswa").value;
            var tglLahirSiswa = document.getElementById("tglLahirSiswa").value;
            var tempatLahirSiswa = document.getElementById("tempatLahirSiswa").value;
            var kordinatSiswa = document.getElementById("Alamatkoordinat").value;
            // console.log(namaSiswa , AlamatSiswa , npsnSiswa , NikSiswa , nisnSiswa  ,SekolahSiswa , tglLahirSiswa , tempatLahirSiswa)
            // console.log($scope.form.idKecamatan, $scope.form.idDesa, $scope.sklhNama1)

            if (namaSiswa.length != 0 && AlamatSiswa.length != 0 && npsnSiswa.length != 0 && NikSiswa.length != 0 && nisnSiswa.length >= 8 && SekolahSiswa.length != 0 && tglLahirSiswa.length != 0 && tempatLahirSiswa.length != 0) {
                $ionicLoading.show();
                var ref = firebase.database().ref("datasiswa/" + nisnSiswa);
                ref.set({
                    alamat: AlamatSiswa,
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
                    // create_by: $scope.formData.nama
                    idDesa: $scope.form.idDesa,
                    idKecamatan: $scope.form.idKecamatan,
                    idsekolah_zonasi: $scope.sklhId1,
                    namaDesa: $scope.namaDesa,
                    namaKecamatan: $scope.namaKecamatan,
                    sekolah_zonasi: $scope.sklhNama1,
                    kordinatzonasi: kordinatSiswa,
                    createAt: createAt
                }).then(function (resp) {
                    var ref = firebase.database().ref("datasiswa_belumdaftar/" + nisnSiswa);
                    ref.set({
                        alamat: AlamatSiswa,
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
                        sekolah_zonasi: $scope.sklhNama1,
                        // create_by: $scope.formData.nama


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

        $scope.jalanUpdateSiswa = function () {
            console.log('JALAN UPDATE status Siswa');
            $ionicLoading.show();
            var ref = firebase.database().ref("siswa");
            var listRef = $firebaseArray(ref);

            listRef.$loaded().then(function (response) {
                // console.log(response);
                for (let index = 0; index < response.length; index++) {
                    // console.log(response[index].status_uprove);
                    if (response[index].status_uprove == false) {
                        // console.log('SKIP');
                    } else {
                        if (response[index].status_uprove == false) {

                        } else {
                            if (response[index].status_daftar == false && response[index].status_daftarZonasi == false) {
                                console.log('Perlu Update');
                                $ionicLoading.hide();
                                // firebase.database().ref('siswa/' + response[index].uid).update({
                                //     status_daftar : true,
                                //     status_daftarZonasi: true,
                                //     status_skl : true,
                                // }).then(function () {
                                //     console.log("UPDATE");
                                //     $ionicLoading.hide()
                                // }
                                // );
                                // $ionicLoading.hide();
                            } else {
                                console.log('SKIP');
                                $ionicLoading.hide();
                            }
                        }
                    }

                }
            })
        }



        // $scope.jalan = function () {
        //     console.log('JALAN UPDATE ID BANJAR DI DATASISWA')
        //     $ionicLoading.show()
        //     var ref = firebase.database().ref("datasiswaTabanan");
        //     var listRef = $firebaseArray(ref);

        //     listRef.$loaded().then(function (response) {
        //         console.log(response);
        //         for (let index = 0; index < response.length; index++) {
        //             // console.log(response[index].id_Sekolah);

        //             var namaBanjar = firebase.database().ref("dataRefSekolahTabanan/" + response[index].id_Sekolah);
        //             var listNamaBanjar = $firebaseArray(namaBanjar);
        //             listNamaBanjar.$loaded().then(function (response2) {
        //                 // console.log(response2[6]);
        //                 if (response2[6] == undefined) {
        //                     // console.log(response2);
        //                     // console.log('SKIP UNDEFINED : ' +response[index].nama_dusun.toLowerCase() + "_" + response[index].ID_DESA.toLowerCase())
        //                     console.log('SKIP UNDEFINED : ');
        //                 } else {
        //                     // console.log(response2);
        //                     $scope.id_sekolah = response2[7].$value;
        //                     $scope.namaSekolah = response2[6].$value;
        //                     firebase.database().ref('datasiswaTabanan/' + response[index].nisn).update({
        //                         id_sd: $scope.id_sekolah,
        //                         sekolah_asal: $scope.namaSekolah,
        //                     }).then(function () {
        //                         console.log("UPDATE");
        //                         $ionicLoading.hide()
        //                     }
        //                     );
        //                 }

        //             });



        //             // if (response[index].status == true) {
        //             //     console.log(response[index].nisn)
        //             //     // $ionicLoading.hide()
        //             //     $scope.id_banjar = response[index].id_banjar;
        //             //     $scope.namaBanjar = response[index].nama_dusun;
        //             //     firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //             //         idBanjar:$scope.id_banjar ,
        //             //         namaBanjar: $scope.namaBanjar,
        //             //     }).then(function () {
        //             //         console.log("UPDATE DATA");
        //             //         $ionicLoading.hide()
        //             //     }
        //             //     );

        //             // } else {
        //             //     // $ionicLoading.hide()
        //             //     firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //             //         idBanjar:'-',
        //             //         namaBanjar: '-',
        //             //     }).then(function () {
        //             //         console.log("UPDATE DATA -");
        //             //         $ionicLoading.hide()
        //             //     }
        //             //     );
        //             // }



        //         }
        //         // $scope.siswa= response;
        //         // $scope.jumlah_siswa = response.length;
        //         // firebase.database().ref('jumlah').update({
        //         //     jumlah_siswa : $scope.jumlah_siswa,
        //         // })

        //     })
        // }

        // $scope.jalan = function () {
        //     console.log('JALAN')
        //     $ionicLoading.show()
        //     var ref = firebase.database().ref("nisnBanjar");
        //     var listRef = $firebaseArray(ref);

        //     listRef.$loaded().then(function (response) {
        //         console.log(response);
        //         for (let index = 0; index < response.length; index++) {
        //             // console.log(response[index]);
        //             if (response[index].status == true) {
        //                 // console.log(index, response[index].nisn, 'TIDAK ADA ID DESA')
        //                 // console.log('BENAR')
        //                 // $ionicLoading.hide()

        //             } else {
        //                 if (response[index].id_banjar == '-') {
        //                     // console.log('SKIP')
        //                     if (response[index].ID_DESA == 'id-desa-') {
        //                         console.log('SKIP ID DESA = -')
        //                     } else {
        //                         if (response[index].nama_dusun == '-') {
        //                             // console.log('nama dusun - ')
        //                         } else {
        //                             // console.log(response[index].nama_dusun.toLowerCase() + "_" + response[index].ID_DESA);
        //                             var temp = response[index].nama_dusun.toLowerCase() + "_" + response[index].ID_DESA.toLowerCase()
        //                             // console.log(temp);
        //                             var namaBanjar = firebase.database().ref("banjar2/" + temp);
        //                             var listNamaBanjar = $firebaseArray(namaBanjar);
        //                             listNamaBanjar.$loaded().then(function (response2) {
        //                                 // console.log(response2[1]);
        //                                 if (response2[1] == undefined) {
        //                                     // console.log(response2);
        //                                     // console.log('SKIP UNDEFINED : ' +response[index].nama_dusun.toLowerCase() + "_" + response[index].ID_DESA.toLowerCase())
        //                                     // console.log('SKIP UNDEFINED : ');
        //                                 } else {
        //                                     // console.log(response2);
        //                                     $scope.id_banjar = response2[1].$value;
        //                                     $scope.namaBanjar = response2[5].$value;
        //                                     firebase.database().ref('nisnBanjar/' + response[index].nisn).update({
        //                                         status: true,
        //                                         id_banjar: $scope.id_banjar,
        //                                         nama_dusun: $scope.namaBanjar,
        //                                     }).then(function () {
        //                                         console.log("TRUE");
        //                                         $ionicLoading.hide()
        //                                     }
        //                                     );

        //                                     // $scope.namaBanjar = response2[5].$value;
        //                                     // console.log(response2[1].$value);
        //                                     // if (response[index].nama_dusun == $scope.namaBanjar) {
        //                                     //     console.log('SKIP UBAH');
        //                                     //     firebase.database().ref('nisnBanjar/' + response[index].nisn).update({
        //                                     //         status: true,

        //                                     //     }).then(function () {
        //                                     //         console.log("TRUE");
        //                                     //         $ionicLoading.hide()
        //                                     //     }
        //                                     //     );
        //                                     // } else {
        //                                     //     // console.log(response2);
        //                                     //     firebase.database().ref('nisnBanjar/' + response[index].nisn).update({
        //                                     //         nama_dusun: $scope.namaBanjar,
        //                                     //     }).then(function () {
        //                                     //         console.log("Update");
        //                                     //         $ionicLoading.hide()
        //                                     //     }
        //                                     //     );
        //                                     // }
        //                                 }

        //                             });
        //                         }
        //                     }

        //                 } else {
        //                     console.log('TIDAK -')
        //                     console.log(response[index].nisn);

        //                     // var namaBanjar = firebase.database().ref("banjar/" + response[index].id_banjar);
        //                     // var listNamaBanjar = $firebaseArray(namaBanjar);
        //                     // listNamaBanjar.$loaded().then(function (response2) {
        //                     //     // console.log(response2[5]);
        //                     //     if (response2[5] == undefined) {
        //                     //         // console.log(response2);
        //                     //     } else {
        //                     //         $scope.namaBanjar = response2[5].$value;
        //                     //         if (response[index].nama_dusun == $scope.namaBanjar) {
        //                     //             console.log('SKIP UBAH');
        //                     //             firebase.database().ref('nisnBanjar/' + response[index].nisn).update({
        //                     //                 status: true,

        //                     //             }).then(function () {
        //                     //                 console.log("TRUE");
        //                     //                 $ionicLoading.hide()
        //                     //             }
        //                     //             );
        //                     //         } else {
        //                     //             // console.log(response2);
        //                     //             firebase.database().ref('nisnBanjar/' + response[index].nisn).update({
        //                     //                 nama_dusun: $scope.namaBanjar,
        //                     //             }).then(function () {
        //                     //                 console.log("Update");
        //                     //                 $ionicLoading.hide()
        //                     //             }
        //                     //             );
        //                     //         }
        //                     //     }

        //                     // });
        //                 }
        //                 // console.log('ADA')
        //                 $ionicLoading.hide()
        //             }



        //         }
        //         // $scope.siswa= response;
        //         // $scope.jumlah_siswa = response.length;
        //         // firebase.database().ref('jumlah').update({
        //         //     jumlah_siswa : $scope.jumlah_siswa,
        //         // })

        //     })
        // }


        // $scope.jalan = function () {
        //     console.log('JALAN UPDATE ID BANJAR DI DATASISWA')
        //     $ionicLoading.show()
        //     var ref = firebase.database().ref("nisnBanjar");
        //     var listRef = $firebaseArray(ref);

        //     listRef.$loaded().then(function (response) {
        //         console.log(response);
        //         for (let index = 0; index < response.length; index++) {
        //             // console.log(response[index]);
        //             if (response[index].status == true) {
        //                 // console.log(response[index].nisn)
        //                 // // $ionicLoading.hide()
        //                 // $scope.id_banjar = response[index].id_banjar;
        //                 // $scope.namaBanjar = response[index].nama_dusun;
        //                 // firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //                 //     idBanjar:$scope.id_banjar ,
        //                 //     namaBanjar: $scope.namaBanjar,
        //                 // }).then(function () {
        //                 //     console.log("UPDATE DATA");
        //                 //     $ionicLoading.hide()
        //                 // }
        //                 // );

        //             } else {
        //                 // $ionicLoading.hide()
        //                 firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //                     idBanjar:'-',
        //                     namaBanjar: '-',
        //                 }).then(function () {
        //                     console.log("UPDATE DATA -");
        //                     $ionicLoading.hide()
        //                 }
        //                 );
        //             }



        //         }
        //         // $scope.siswa= response;
        //         // $scope.jumlah_siswa = response.length;
        //         // firebase.database().ref('jumlah').update({
        //         //     jumlah_siswa : $scope.jumlah_siswa,
        //         // })

        //     })
        // }



        // $scope.jalan = function () {
        //     console.log('JALAN')
        //     $ionicLoading.show()
        //     var ref = firebase.database().ref("banjartambah");
        //     var listRef = $firebaseArray(ref);

        //     listRef.$loaded().then(function (response) {
        //         console.log(response);
        //         for (let index = 0; index < response.length; index++) {
        //             console.log(response[index].alamat_smp);
        //             if (response[index].alamat_smp == '-') {
        //                 var temp = response[index].id_desa;
        //                 var namaBanjar = firebase.database().ref("desa/" + temp);
        //                 var listNamaBanjar = $firebaseArray(namaBanjar);
        //                 listNamaBanjar.$loaded().then(function (response2) {
        //                     // console.log(response2[0]);
        //                     // $ionicLoading.hide()
        //                     if (response2[0] != undefined) {
        //                         // console.log(response2[0].$value);
        //                         // console.log(response2[2].$value);
        //                         // console.log(response2[3].$value);
        //                         // console.log(response2[5].$value);

        //                         $scope.alamat_smp = response2[0].$value;
        //                         $scope.idKecamatan = response2[2].$value;
        //                         $scope.npsn = response2[3].$value;
        //                         $scope.nama_smp = response2[5].$value;
        //                         var id = response[index].$id;

        //                         firebase.database().ref('banjartambah/' + id).update({
        //                             alamat_smp: $scope.alamat_smp,
        //                             id_kecamatan:  $scope.idKecamatan,
        //                             id_smp: $scope.npsn,
        //                             nama_smp: $scope.nama_smp,
        //                         }).then(function () {
        //                             console.log("UPDATE");
        //                             $ionicLoading.hide()
        //                         }
        //                         );
        //                     } else {
        //                         // console.log(response[index].$id);
        //                     }


        //                 });
        //             } else {

        //             }




        //         }
        //     })
        // }


    }])