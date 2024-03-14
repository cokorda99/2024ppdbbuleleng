angular.module('app.dataPendaftar', [])

    .controller('dataPendaftarCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var cekBukaJalurZonasi = firebase.database().ref('pengaturan').child('buka_jalurZonasi');
        cekBukaJalurZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurZonasi = dataSnapShot.val().aktif;
        })
        var cekBukaJalurAfirmasi = firebase.database().ref('pengaturan').child('buka_jalurAfirmasi');
        cekBukaJalurAfirmasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurAfirmasi = dataSnapShot.val().aktif;
        })
        var cekBukaJalurPerpindahan = firebase.database().ref('pengaturan').child('buka_jalurPerpindahan');
        cekBukaJalurPerpindahan.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPerpindahan = dataSnapShot.val().aktif;
        })
        var cekBukaJalurPrestasi = firebase.database().ref('pengaturan').child('buka_jalurPrestasi');
        cekBukaJalurPrestasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPrestasi = dataSnapShot.val().aktif;
        })


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


        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })

        var cekBukaSiswaZonasi = firebase.database().ref('pengaturan').child('bukaSiswaZonasi');
        cekBukaSiswaZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaSiswaZonasi = dataSnapShot.val().aktif;
            console.log($scope.cekBukaSiswaZonasi);
        })
        $('#btn-data-ranking').on('click', function () {
            if ($('#btn-data-ranking').hasClass('selected')) {
                $('#btn-data-ranking').removeClass('selected');
            } else {
                $('#btn-data-ranking').addClass('selected');
            }
        });
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
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pendaftar_zonasi = function () {
            $state.go('dataPendaftarZonasi');
        }
        $scope.pendaftar_afirmasi = function () {
            $state.go('dataPendaftarAfirmasi');
        }
        $scope.pendaftar_prestasi = function () {
            $state.go('dataPendaftarPrestasi');
        }
        $scope.pendaftar_perpindahan = function () {
            $state.go('dataPendaftarPerpindahan');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }

        $scope.ranking_zonasi = function () {
            $state.go('dataRankingSekolahZonasi');
        }
        $scope.ranking_afirmasi = function () {
            $state.go('dataRankingSekolahAfirmasi');
        }
        $scope.ranking_perpindahan = function () {
            $state.go('dataRankingSekolahPerpindahan');
        }
        $scope.ranking_prestasi = function () {
            $state.go('dataRankingSekolahPrestasi');
        }



        // var canvas_jalur = document.getElementById('chart_jalur').getContext('2d');
        // var canvas_status = document.getElementById('chart_status_pendaftaran').getContext('2d');
        $ionicLoading.hide();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid)
                $ionicLoading.hide();
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('admin_sekolah');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sekolah').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "namaSekolah": dataSnapShot.val().namaSekolah,
                                    "npsn": dataSnapShot.val().npsn,

                                };

                                // LOAD JUMLAH PENDAFTAR ZONASI
                                var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi");
                                var listRef = $firebaseArray(ref);

                                $ionicLoading.show();
                                listRef.$loaded().then(function (response) {
                                    $ionicLoading.hide();
                                    console.log(response.length);
                                    $scope.jumlahsiswazonasi = response.length;
                                }).then(function (response) {
                                    // LOAD JUMLAH PENDAFTAR AFIRMASI
                                    var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi");
                                    var listRef = $firebaseArray(ref);
                                    $ionicLoading.show();
                                    listRef.$loaded().then(function (response) {
                                        $ionicLoading.hide();
                                        console.log(response.length);
                                        $scope.jumlahsiswaafirmasi = response.length;
                                    }).then(function (response) {
                                        // LOAD JUMLAH PENDAFTAR PRESTASI
                                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi");
                                        var listRef = $firebaseArray(ref);

                                        $ionicLoading.show();
                                        listRef.$loaded().then(function (response) {
                                            $ionicLoading.hide();
                                            console.log(response.length);
                                            $scope.jumlahsiswaprestasi = response.length;
                                        }).then(function (respone) {
                                            // LOAD JUMLAH PENDAFTAR PERPINDAHAN
                                            var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan");
                                            var listRef = $firebaseArray(ref);

                                            $ionicLoading.show();
                                            listRef.$loaded().then(function (response) {
                                                $ionicLoading.hide();
                                                console.log(response.length);
                                                $scope.jumlahsiswaperpindahan = response.length;

                                            }).then(function (response) {
                                                var jmlPerpindahan = parseInt($scope.jumlahsiswaperpindahan);
                                                var jmlZonasi = parseInt($scope.jumlahsiswazonasi);
                                                var jmlAfrimasi = parseInt($scope.jumlahsiswaafirmasi);
                                                var jmlPrestasi = parseInt($scope.jumlahsiswaprestasi);
                                                var totalPendaftarSpan = (jmlZonasi + jmlPrestasi + jmlAfrimasi + jmlPerpindahan);
                                                $('#total_pendaftarSpan').text(totalPendaftarSpan);
                                                $('#spanJmlZonasi').text(jmlZonasi);
                                                $('#spanJmlAfirmasi').text(jmlAfrimasi);
                                                $('#spanJmlPrestasi').text(jmlPrestasi);
                                                $('#spanJmlPerpindahan').text(jmlPerpindahan);
                                            })
                                        })
                                    })
                                })

                                // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                                // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                                // var exc = npsnExc.includes($scope.formData.npsn);
                                // if (exc) {
                                //     disListRayon.style.display = "block";
                                // }
                                // var canvas_jalur = document.getElementById('chart_jalur').getContext('2d');
                                // var canvas_status = document.getElementById('chart_status').getContext('2d');
                                // var data_pie = {
                                //     labels: [
                                //       'Zonasi',
                                //       'Afirmasi',
                                //       'Perpindahan',
                                //       'Prestasi'
                                //     ],
                                //     datasets: [{
                                //       label: 'Jumlah Pendaftaran Per Jalur',
                                //       data: [$scope.jml_sis_zonasi, 50, 100],
                                //       backgroundColor: [
                                //         'rgb(255, 99, 132)',
                                //         'rgb(54, 162, 235)',
                                //         'rgb(255, 205, 86)'
                                //       ],
                                //       hoverOffset: 4
                                //     }]
                                //   };

                                //     var data = {
                                //     labels: ['Belum Valid','Sudah Valid'],
                                //     datasets: [{
                                //         label: 'Jumlah Pendaftaran',
                                //         data: [65, 59, 80, 81, 56, 55, 40],
                                //         backgroundColor: [
                                //         'rgba(255, 99, 132, 0.2)',
                                //         'rgba(255, 159, 64, 0.2)',
                                //         'rgba(255, 205, 86, 0.2)',
                                //         'rgba(75, 192, 192, 0.2)',
                                //         'rgba(54, 162, 235, 0.2)',
                                //         'rgba(153, 102, 255, 0.2)',
                                //         'rgba(201, 203, 207, 0.2)'
                                //         ],
                                //         borderColor: [
                                //         'rgb(255, 99, 132)',
                                //         'rgb(255, 159, 64)',
                                //         'rgb(255, 205, 86)',
                                //         'rgb(75, 192, 192)',
                                //         'rgb(54, 162, 235)',
                                //         'rgb(153, 102, 255)',
                                //         'rgb(201, 203, 207)'
                                //         ],
                                //         borderWidth: 1
                                //     }]
                                //     };
                                // var chart_jalur = new Chart(canvas_jalur, {
                                //     type: 'pie',
                                //     data: data_pie,
                                // });
                                // var chart_status = new Chart(canvas_status, {
                                //     type: 'bar',
                                //     data: data,
                                //     options: {
                                //       scales: {
                                //         y: {
                                //           beginAtZero: true
                                //         }
                                //       }
                                //     },
                                // });


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

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });


    }])
    .controller('dataPendaftarZonasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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


        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })

        var cekBukaSiswaZonasi = firebase.database().ref('pengaturan').child('bukaSiswaZonasi');
        cekBukaSiswaZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaSiswaZonasi = dataSnapShot.val().aktif;
            console.log($scope.cekBukaSiswaZonasi);
        })
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
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }
        $scope.ranking_zonasi = function () {
            $state.go('dataRankingSekolahZonasi');
        }
        $scope.ranking_afirmasi = function () {
            $state.go('dataRankingSekolahAfirmasi');
        }
        $scope.ranking_perpindahan = function () {
            $state.go('dataRankingSekolahPerpindahan');
        }
        $scope.ranking_prestasi = function () {
            $state.go('dataRankingSekolahPrestasi');
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
                var pengguna = dbRef.ref('admin_sekolah');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sekolah').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "npsn": dataSnapShot.val().npsn,

                                };

                            })
                        });

                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }

                        // LOAD DATA PENDAFTAR
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi");
                        var listRef = $firebaseArray(ref);

                        $ionicLoading.show();
                        var index = 0
                        listRef.$loaded().then(function (response) {
                            $ionicLoading.hide();

                            $scope.siswa = response;

                            jarakBaru = response[index].jarak / 1000;
                            console.log(response);
                            tes = 1;
                            finalPoinBaru = tes + '.' + jarakBaru;
                            console.log(finalPoinBaru);

                            // var data;
                            // for (data in response) {
                            //     // console.log(data);
                            //     // console.log(response[data].jarak);
                            //     key1 = response[data].$id;
                            //     nisn = response[data].nisn;
                            //     status_uprove = response[data].status_uprove;
                            //     // console.log(key1);

                            //     poinKK = response[data].poinStatusKK
                            //     tesjarak = response[data].jarak / 1000;

                            //     if (poinKK && tesjarak != undefined) {
                            //         // console.log(poinKK + '.' + tesjarak);
                            //         console.log(data + ' '+ nisn + ' ' + status_uprove);
                            //         if (status_uprove == true) {
                            //             firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + key1).update({
                            //                 finalPoin3: poinKK + '.' + tesjarak,
                            //             }).then(function (response) {
                            //                 // console.log('UPDATE SISWA');
                            //                 firebase.database().ref("siswa/" + key1).update({
                            //                     finalPoin3: poinKK + '.' + tesjarak,
                            //                 })
                            //             })    
                            //         } else {
                            //             firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + key1).update({
                            //                 finalPoin3: '3.' + tesjarak,
                            //             }).then(function (response) {
                            //                 // console.log('UPDATE SISWA');
                            //                 firebase.database().ref("siswa/" + key1).update({
                            //                     finalPoin3: '3.' + tesjarak,
                            //                 })
                            //             })  
                            //         }
                            //     } else {
                            //         console.log('SALAH');
                            //     }



                            // }

                        })

                        //Verifikasi
                        var updateID = '';
                        $('body').on('click', '.verifikasiData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnVerif").value = values.nisn;
                                document.getElementById("nikVerif").value = values.nik;
                                document.getElementById("namaVerif").value = values.nama;
                                document.getElementById("alamatsiswaVerif").value = values.alamat;
                                document.getElementById("alamatVerif").value = values.alamatzonasi;
                                document.getElementById("sekolahVerif").value = values.sekolah_asal;
                                document.getElementById("tglLahirVerif").value = values.tanggal_lahir;
                                document.getElementById("jarakVerif").value = values.jarak;
                                document.getElementById("noSKLVerif").value = values.nomor_skl;
                                document.getElementById("nilaiSKLVerif").value = values.nilai_skl;
                                document.getElementById("noKKVerif").value = values.noKK;
                                document.getElementById("statusKKVerif").value = values.statusKK;


                                firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                                    var data = snapshot.val();
                                    var url = data.URL
                                    console.log(url);

                                    $scope.lihatFileSKL = function () {
                                        window.open(url);
                                    }

                                })

                                var nama = values.nama
                                var id_sd = values.id_sd
                                // #verif
                                $scope.verifikasi_siswa = function () {
                                    const swalLogout = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-success ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalLogout.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin untuk memvalidasi?, data yang tervalidasi sudah dinyatakan benar & tidak dapat di batalkan atau di koreksi kembali',
                                        showCancelButton: true,
                                        confirmButtonText: 'Validasi',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            firebase.database().ref('siswa/' + updateID).update({
                                                status_uprove: true,
                                            });

                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                                status_uprove: true,
                                            });

                                            // UPDATE DATABASE RANKING ZONASI 
                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi_rank/" + updateID).update({
                                                status_uprove: true,
                                                finalPoin: values.finalPoin,
                                                id_sd: values.id_sd,
                                                jalur: values.jalur,
                                                jalurNama: values.jalurNama,
                                                jarak: values.jarak,
                                                nama: values.nama,
                                                nisn: values.nisn,
                                                no_pendaftaran: values.no_pendaftaran,
                                                poinStatusKK: values.poinStatusKK,
                                                sekolah_asal: values.sekolah_asal,
                                                statusKK: values.statusKK,
                                                status_terima: values.status_terima,
                                                uid: values.uid

                                            });

                                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                                status_uprove: true,
                                            });

                                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Sukses',
                                                text: 'Data Berhasil di Validasi',
                                            })
                                        }
                                    })



                                }

                                $scope.batalverifikasi_siswa = function () {

                                    firebase.database().ref('siswa/' + updateID).update({
                                        status_uprove: false,
                                    });

                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                        status_uprove: false,
                                    });

                                    // HAPUS DATA RANK ZONASI PADA DATABASE RANK ZONASI
                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi_rank/" + updateID).remove();

                                    firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                        status_uprove: false,
                                    });
                                    // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Sukses',
                                        text: 'Validasi Berhasil Di Batalkan',
                                    })
                                }

                            });
                        });
                        firebase.database().ref('sekolah').child($scope.formData.npsn).on('value', (dataSnapShot1) => {

                            // $scope.kuotaAfirmasi = dataSnapShot1.val().kuota_afir;
                            $scope.namaSmp = dataSnapShot1.val().sekolah;

                        })
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-pendaftar-zonasi'));
                            XLSX.writeFile(wb, "Pendaftar Zonasi " + $scope.namaSmp + ".xlsx");
                        }

                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref('siswa/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;


                                var idSD = values.id_sd;
                                var idSMP = $scope.formData.npsn


                                var nama = values.nama;
                                $scope.status_daftar = values.status_daftar;
                                console.log($scope.status_daftar);
                                // if ($scope.status_daftar == true) {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // } else {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar' checked>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // }


                                $scope.simpan = function () {

                                    var chekdaftar = document.querySelector('.form-check-input').checked;
                                    var koreksi = document.getElementById("PesanKoreksi").value;

                                    // console.log(chekdaftar);
                                    // console.log(koreksi);
                                    if (koreksi != '') {
                                        console.log('JALAN');
                                        if (chekdaftar == true) {
                                            console.log('TesON')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            const swalLogout = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalLogout.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Apakah anda yakin ingin membuka akses ? , membuka akses akan membuat pendaftar harus mengulang kembali proses pendaftaran nya dari awal',
                                                showCancelButton: true,
                                                confirmButtonText: 'Buka Akses',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    console.log('EKSEKUSI');

                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        status_daftar: false,
                                                        // status_daftarJalur: false,
                                                        status_daftarZonasi: false,
                                                        status_terima: false,
                                                        status_uprove: false,
                                                        status_skl: false,
                                                        koreksi: koreksi,
                                                    });

                                                    firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                                    firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                                    // firebase.database().ref('siswa/' + updateID + '/file').remove();
                                                } else {
                                                    console.log('BATAL');
                                                }
                                            })


                                        } else {
                                            console.log('TesOFF')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'Buka koreksi belum aktif, data tidak akan berubah',
                                                focusConfirm: false
                                            })
                                            // firebase.database().ref('siswa/' + updateID).update({
                                            //     status_daftar: true,
                                            //     status_skl: true,
                                            //     koreksi: koreksi,
                                            // });
                                        }
                                        // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                        // $("#modal_edit").modal('hide')
                                        // $("#alert-verif-warning").show(function () {
                                        //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                        //         $("#alert-verif-warning").slideUp(500);
                                        //     });
                                        // });
                                    } else {
                                        $("#modal_edit").find('form').trigger('reset');
                                        $("#modal_edit").modal('hide')
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Pesan koreksi tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }


                                }
                                // document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                                // document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                                // document.getElementById("alamatEdit").value = values.alamat;

                            });
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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });


    }])
    .controller('dataPendaftarAfirmasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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


        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })

        var cekBukaSiswaZonasi = firebase.database().ref('pengaturan').child('bukaSiswaZonasi');
        cekBukaSiswaZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaSiswaZonasi = dataSnapShot.val().aktif;
            console.log($scope.cekBukaSiswaZonasi);
        })
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
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }
        $scope.ranking_zonasi = function () {
            $state.go('dataRankingSekolahZonasi');
        }
        $scope.ranking_afirmasi = function () {
            $state.go('dataRankingSekolahAfirmasi');
        }
        $scope.ranking_perpindahan = function () {
            $state.go('dataRankingSekolahPerpindahan');
        }
        $scope.ranking_prestasi = function () {
            $state.go('dataRankingSekolahPrestasi');
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
                var pengguna = dbRef.ref('admin_sekolah');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sekolah').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "npsn": dataSnapShot.val().npsn,

                                };

                            })
                        });
                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }

                        // LOAD DATA PENDAFTAR
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi");
                        console.log("smp/" + $scope.formData.npsn + "/afirmasi");
                        var listRef = $firebaseArray(ref);

                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {

                            console.log(response);
                            $scope.siswa = response;

                            // var data;
                            // for (data in response) {
                            //     key1 = response[data].$id;

                            //     status_uproveBaru =response[data].status_uprove2;
                            //     nama = response[data].nama;
                            //     nisn = response[data].nisn;
                            //     console.log(status_uproveBaru+ '' + nama);

                            //     if (status_uproveBaru == true && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + key1).update({
                            //             status_uprove2: true,
                            //             no_pendaftaran2 : 'afirmasi/2023/'+$scope.formData.npsn+'/'+nisn,
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: true,
                            //             })
                            //         })


                            //     } else if (status_uproveBaru == false && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + key1).update({
                            //             status_uprove2: false,
                            //             no_pendaftaran2 : 'afirmasi/2023/'+$scope.formData.npsn+'/'+nisn,
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: false,
                            //             })
                            //         })
                            //     }else if (status_uproveBaru == undefined && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + key1).update({
                            //             status_uprove2: false,
                            //             no_pendaftaran2 : 'afirmasi/2023/'+$scope.formData.npsn+'/'+nisn,
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: false,
                            //             })
                            //         })
                            //     }else {
                            //         console.log('SALAH');
                            //     }

                            //     // // if (poinKK && tesjarak != undefined) {
                            //     // //     console.log(poinKK + '.' + tesjarak);
                            //     // //     console.log(key1);



                            //     // // } else {
                            //     // //     console.log('SALAH');
                            //     // // }



                            // }
                            $ionicLoading.hide();
                        })

                        //Verifikasi
                        var updateID = '';
                        $('body').on('click', '.verifikasiData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnVerif").value = values.nisn;
                                document.getElementById("nikVerif").value = values.nik;
                                document.getElementById("namaVerif").value = values.nama;
                                document.getElementById("alamatsiswaVerif").value = values.alamat;
                                document.getElementById("alamatVerif").value = values.alamatzonasi;
                                document.getElementById("sekolahVerif").value = values.sekolah_asal;
                                document.getElementById("tglLahirVerif").value = values.tanggal_lahir;
                                // document.getElementById("jarakVerif").value = values.jarak;
                                document.getElementById("noSKLVerif").value = values.nomor_skl;
                                document.getElementById("nilaiSKLVerif").value = values.nilai_skl;
                                document.getElementById("noKKVerif").value = values.noKK;
                                document.getElementById("statusKKVerif").value = values.statusKK;


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
                                    const swalLogout = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-success ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalLogout.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin untuk memvalidasi?, data yang tervalidasi sudah dinyatakan benar & tidak dapat di batalkan atau di koreksi kembali',
                                        showCancelButton: true,
                                        confirmButtonText: 'Validasi',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            firebase.database().ref('siswa/' + updateID).update({
                                                status_uprove2: true,
                                            });

                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                                status_uprove2: true,

                                            });

                                            // UPDATE DATABASE RANKING AFIRMASI
                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi_rank/" + updateID).update({
                                                status_uprove2: true,
                                                finalPoin: values.finalPoin,
                                                id_sd: values.id_sd,
                                                jalur: values.jalur,
                                                jalurNama: values.jalurNama,
                                                jarak: values.jarak,
                                                nama: values.nama,
                                                nisn: values.nisn,
                                                no_pendaftaran: values.no_pendaftaran,
                                                poinStatusKK: values.poinStatusKK,
                                                sekolah_asal: values.sekolah_asal,
                                                statusKK: values.statusKK,
                                                status_terima: values.status_terima,
                                                uid: values.uid

                                            });

                                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                                status_uprove2: true,
                                            });

                                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Sukses',
                                                text: 'Data Berhasil di Validasi',
                                            })
                                        }
                                    })


                                }

                                $scope.batalverifikasi_siswa = function () {

                                    firebase.database().ref('siswa/' + updateID).update({
                                        status_uprove2: false,
                                    });

                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                        status_uprove2: false,
                                    });

                                    // HAPUS DATA RANK ZONASI PADA DATABASE RANK ZONASI
                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi_rank/" + updateID).remove();

                                    firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                        status_uprove2: false,
                                    });
                                    // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Sukses',
                                        text: 'Validasi Berhasil Di Batalkan',
                                    })
                                }

                            });
                        });
                        firebase.database().ref('sekolah').child($scope.formData.npsn).on('value', (dataSnapShot1) => {

                            // $scope.kuotaAfirmasi = dataSnapShot1.val().kuota_afir;
                            $scope.namaSmp = dataSnapShot1.val().sekolah;

                        })
                        $scope.cetakPendaftarAfirmasi = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-pendaftar-afirmasi'));
                            XLSX.writeFile(wb, "Pendaftar Afirmasi " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref('siswa/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;

                                var idSD = values.id_sd;
                                var idSMP = $scope.formData.npsn

                                var nama = values.nama;
                                $scope.status_daftar = values.status_daftar;
                                console.log($scope.status_daftar);

                                // if ($scope.status_daftarJalur == true) {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // } else {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // }

                                $scope.simpanEditAfirmasi = function () {

                                    var chekdaftar = document.querySelector('.form-check-input').checked;
                                    var koreksi = document.getElementById("PesanKoreksi").value;

                                    console.log(chekdaftar);
                                    // console.log(koreksi);
                                    if (koreksi != '') {
                                        console.log('JALAN');
                                        if (chekdaftar == true) {
                                            console.log('TesON')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            const swalLogout = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalLogout.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Apakah anda yakin ingin membuka akses ? , membuka akses akan membuat pendaftar harus mengulang kembali proses pendaftaran nya dari awal',
                                                showCancelButton: true,
                                                confirmButtonText: 'Buka Akses',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    console.log('EKSEKUSI');

                                                    firebase.database().ref('smp/' + $scope.formData.npsn + '/afirmasi/' + updateID).remove()
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        status_daftar: false,
                                                        status_daftarJalur: false,
                                                        status_terima: false,
                                                        status_uprove2: false,
                                                        koreksi: koreksi,
                                                    })
                                                    firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                                    console.log('sd/' + idSD + '/' + updateID);
                                                    // firebase.database().ref('siswa/' + updateID + '/fileDok').remove();
                                                } else {
                                                    console.log('BATAL');
                                                }
                                            })


                                        } else {
                                            console.log('TesOFF')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'Buka koreksi belum aktif, data tidak akan berubah',
                                                focusConfirm: false
                                            })
                                            // firebase.database().ref('siswa/' + updateID).update({
                                            //     status_daftar: true,
                                            //     status_skl: true,
                                            //     koreksi: koreksi,
                                            // });
                                        }
                                        // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                        // $("#modal_edit").modal('hide')
                                        // $("#alert-verif-warning").show(function () {
                                        //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                        //         $("#alert-verif-warning").slideUp(500);
                                        //     });
                                        // });
                                    } else {
                                        $("#modal_edit").modal('hide')
                                        $("#modal_edit").find('form').trigger('reset');
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Pesan koreksi tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }
                                }
                                // document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                                // document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                                // document.getElementById("alamatEdit").value = values.alamat;

                            });
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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
    .controller('dataPendaftarPrestasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


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
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }
        $scope.ranking_zonasi = function () {
            $state.go('dataRankingSekolahZonasi');
        }
        $scope.ranking_afirmasi = function () {
            $state.go('dataRankingSekolahAfirmasi');
        }
        $scope.ranking_perpindahan = function () {
            $state.go('dataRankingSekolahPerpindahan');
        }
        $scope.ranking_prestasi = function () {
            $state.go('dataRankingSekolahPrestasi');
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
                var pengguna = dbRef.ref('admin_sekolah');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sekolah').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "npsn": dataSnapShot.val().npsn,

                                };

                            })
                        });
                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }

                        // LOAD DATA PENDAFTAR
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi");
                        var listRef = $firebaseArray(ref);

                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            console.log(response);
                            $scope.siswa = response;

                            // for (data in response) {
                            //     // console.log(response[data].nisn)
                            //     if (response[data].nisn != undefined) {
                            //         if (response[data].status_uprove2 == true) {
                            //             console.log('UPDATE PADA RANKING')
                            //             // UPDATE DATABASE RANKING Prestasi
                            //             firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi_rank/" + response[data].uid).update({
                            //                 status_uprove2: true,
                            //                 jalur2:response[data].jalur2,
                            //                 jalurNama2:response[data].jalurNama2,
                            //                 no_pendaftaran2:response[data].no_pendaftaran2,
                            //                 poinPrestasi:parseFloat(response[data].poinPrestasi),
                            //             });
                            //         } else {
                            //             console.log('SKIP BELUM VALID')
                            //         }
                            //     } else {
                            //         console.log('SKIP')
                            //     }
                            // }

                            // var data;
                            // for (data in response) {
                            //     key1 = response[data].$id;
                            //     nilai = response[data].poinPrestasi;

                            //     status_uproveBaru =response[data].status_uprove2;
                            //     nama = response[data].nama;
                            //     nisn = response[data].nisn;
                            //     console.log(nilai+ ' ' + nisn);

                            //     if (status_uproveBaru == true && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + key1).update({
                            //             status_uprove2: true,
                            //             no_pendaftaran2 : 'prestasi/2023/'+$scope.formData.npsn+'/'+nisn,
                            //             poinPrestasi:parseInt(nilai),
                            //             poinPrestasi2 :parseInt(-nilai),
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: true,
                            //             })
                            //         })


                            //     } else if (status_uproveBaru == false && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + key1).update({
                            //             status_uprove2: false,
                            //             no_pendaftaran2 : 'prestasi/2023/'+$scope.formData.npsn+'/'+nisn,
                            //             poinPrestasi:parseInt(nilai),
                            //             poinPrestasi2 :parseInt(-nilai),
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: false,
                            //             })
                            //         })
                            //     }else if (status_uproveBaru == undefined && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + key1).update({
                            //             status_uprove2: false,
                            //             no_pendaftaran2 : 'prestasi/2023/'+$scope.formData.npsn+'/'+nisn,
                            //             poinPrestasi:parseInt(nilai),
                            //             poinPrestasi2 :parseInt(-nilai),
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: false,
                            //             })
                            //         })
                            //     }else {
                            //         console.log('SALAH');
                            //     }

                            //     // // if (poinKK && tesjarak != undefined) {
                            //     // //     console.log(poinKK + '.' + tesjarak);
                            //     // //     console.log(key1);



                            //     // // } else {
                            //     // //     console.log('SALAH');
                            //     // // }



                            // }

                            $ionicLoading.hide();
                        })

                        //Verifikasi
                        var updateID = '';
                        $('body').on('click', '.verifikasiData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnVerif").value = values.nisn;
                                document.getElementById("nikVerif").value = values.nik;
                                document.getElementById("namaVerif").value = values.nama;
                                // document.getElementById("alamatVerif").value = values.alamatzonasi + " , " + values.namaDesa;
                                document.getElementById("tglLahirVerif").value = values.tanggal_lahir;
                                document.getElementById("poinPrestasi").value = values.poinPrestasi;
                                document.getElementById("noSKLVerif").value = values.nomor_skl;
                                document.getElementById("nilaiSKLVerif").value = values.nilai_skl;
                                document.getElementById("sekolahAsalSD").value = values.sekolah_asal;
                                document.getElementById("akumulasiNilaiRap").value = values.akumulasiRaporPrestasi;

                                // document.getElementById("berkasPress").value = values.berkasprestasi;
                                // $scope.jenisPress = values.jenisPrestasi;
                                // if ($scope.jenisPress !== 'keterampilan') {
                                //     $('#berkasBuktiPrestasi').show();
                                //     $('#berkasBuktiKeterampilan').hide();

                                // } else {
                                //     $('#berkasBuktiPrestasi').hide();
                                //     $('#berkasBuktiKeterampilan').show();
                                // }
                                document.getElementById("jenisPress").value = values.jenisPrestasi;
                                console.log('JENIS PRESTASI : ' + values.jenisPrestasi)
                                if (values.jenisPrestasi == 'Keterampilan Lain') {
                                    document.getElementById("tingkatPress").value = '-';
                                    document.getElementById("kompetisi").value = values.deskripsiKeterampilan;
                                    document.getElementById("cabang").value = '-';
                                    document.getElementById("peringkatPress").value = '-';
                                } else if (values.jenisPrestasi == 'Jalur Nilai Rapor') {
                                    document.getElementById("tingkatPress").value = '-';
                                    document.getElementById("kompetisi").value = 'Jalur Nilai Rapor';
                                    document.getElementById("cabang").value = '-';
                                    document.getElementById("peringkatPress").value = '-';
                                }
                                else {
                                    document.getElementById("tingkatPress").value = values.tingkatprestasi;
                                    document.getElementById("kompetisi").value = values.namaKompetisi;
                                    document.getElementById("cabang").value = values.cabang;
                                    document.getElementById("peringkatPress").value = values.peringkat;

                                }



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

                                    var poinPrestasi = document.getElementById("poinPrestasi").value
                                    console.log(poinPrestasi);
                                    if (poinPrestasi.length != 0) {
                                        const swalLogout = Swal.mixin({
                                            customClass: {
                                                confirmButton: 'btn btn-success ms-2',
                                                cancelButton: 'btn btn-outline-secondary'
                                            },
                                            buttonsStyling: false
                                        })
                                        swalLogout.fire({
                                            title: 'Perhatian',
                                            icon: 'warning',
                                            text: 'Apakah anda yakin untuk memvalidasi?, data yang tervalidasi sudah dinyatakan benar & tidak dapat di batalkan atau di koreksi kembali',
                                            showCancelButton: true,
                                            confirmButtonText: 'Validasi',
                                            reverseButtons: true
                                        }).then((result) => {
                                            if (result.isConfirmed) {
                                                firebase.database().ref('siswa/' + updateID).update({
                                                    status_uprove2: true,
                                                    poinPrestasi: poinPrestasi
                                                });

                                                // UPDATE DATABASE RANKING Prestasi
                                                firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi_rank/" + updateID).update({
                                                    status_uprove2: true,
                                                    finalPoin: values.finalPoin,
                                                    id_sd: values.id_sd,
                                                    jalur: values.jalur,
                                                    jalurNama: values.jalurNama,
                                                    jarak: values.jarak,
                                                    nama: values.nama,
                                                    nisn: values.nisn,
                                                    no_pendaftaran: values.no_pendaftaran,
                                                    poinStatusKK: values.poinStatusKK,
                                                    sekolah_asal: values.sekolah_asal,
                                                    statusKK: values.statusKK,
                                                    status_terima: values.status_terima,
                                                    uid: values.uid

                                                });
                                                firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                                    status_uprove2: true,
                                                    poinPrestasi: poinPrestasi
                                                });

                                                firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                                    status_uprove2: true,
                                                });

                                                firebase.database().ref('siswa/' + updateID).update({
                                                    status_uprove2: true,
                                                });

                                                // window.alert('Verifikasi Data ' + nama + ' Succes')
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Sukses',
                                                    text: 'Data Berhasil di Validasi',
                                                })
                                            }
                                        })

                                    } else {
                                        // window.alert('ISI POIN PRESTASI')
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Isi Poin Prestasi',
                                        })
                                    }
                                }

                                $scope.batalverifikasi_siswa = function () {


                                    firebase.database().ref('siswa/' + updateID).update({
                                        status_uprove2: false,
                                        // poinPrestasi: poinPrestasiinput
                                    });

                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                        status_uprove2: false,
                                        // poinPrestasi: poinPrestasiinput
                                    });

                                    // HAPUS DATA RANK ZONASI PADA DATABASE RANK ZONASI
                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi_rank/" + updateID).remove();

                                    firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                        status_uprove2: false,
                                    });
                                    // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Sukses',
                                        text: 'Validasi Berhasil Di Batalkan',
                                    })
                                }

                            });
                        });
                        firebase.database().ref('sekolah').child($scope.formData.npsn).on('value', (dataSnapShot1) => {

                            // $scope.kuotaAfirmasi = dataSnapShot1.val().kuota_afir;
                            $scope.namaSmp = dataSnapShot1.val().sekolah;

                        })
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-pendaftar-prestasi'));
                            XLSX.writeFile(wb, "Pendaftar Prestasi " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref('siswa/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;


                                var idSD = values.id_sd;

                                $scope.status_daftar = values.status_daftar;
                                console.log($scope.status_daftar);
                                // if ($scope.status_daftar == true) {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // } else {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // }


                                $scope.simpan = function () {

                                    var chekdaftar = document.querySelector('.form-check-input').checked;
                                    var koreksi = document.getElementById("PesanKoreksi").value;

                                    console.log(chekdaftar);
                                    console.log(koreksi);

                                    if (koreksi != '') {
                                        console.log('JALAN');
                                        if (chekdaftar == true) {
                                            console.log('TesON')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            const swalLogout = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalLogout.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Apakah anda yakin ingin membuka akses ? , membuka akses akan membuat pendaftar harus mengulang kembali proses pendaftaran nya dari awal',
                                                showCancelButton: true,
                                                confirmButtonText: 'Buka Akses',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    console.log('EKSEKUSI');
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        status_daftar: false,
                                                        status_daftarJalur: false,
                                                        status_terima: false,
                                                        status_uprove2: false,
                                                        koreksi: koreksi,
                                                    });

                                                    firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                                    firebase.database().ref('smp/' + $scope.formData.npsn + '/prestasi/' + updateID).remove();
                                                    // firebase.database().ref('siswa/' + updateID + '/file').remove();
                                                    // firebase.database().ref('siswa/' + updateID + '/fileDokPrestasi').remove();
                                                } else {
                                                    console.log('BATAL');
                                                }
                                            })


                                        } else {
                                            console.log('TesOFF')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'Buka koreksi belum aktif, data tidak akan berubah',
                                                focusConfirm: false
                                            })
                                            // firebase.database().ref('siswa/' + updateID).update({
                                            //     status_daftar: true,
                                            //     status_skl: true,
                                            //     koreksi: koreksi,
                                            // });
                                        }
                                        // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                        // $("#modal_edit").modal('hide')
                                        // $("#alert-verif-warning").show(function () {
                                        //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                        //         $("#alert-verif-warning").slideUp(500);
                                        //     });
                                        // });
                                    } else {
                                        $("#modal_edit").modal('hide')
                                        $("#modal_edit").find('form').trigger('reset');
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Pesan koreksi tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }

                                    // if (chekdaftar == 'on') {
                                    //     firebase.database().ref('siswa/' + updateID).update({
                                    //         status_daftar: false,
                                    //         status_daftarJalur: false,
                                    //         status_daftarZonasi: false,
                                    //         status_skl: false,
                                    //         status_terima: false,
                                    //         status_uprove2: false,
                                    //         status_skl: false,
                                    //         koreksi: koreksi,
                                    //     });

                                    //     firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                    //     firebase.database().ref('smp/' + $scope.formData.npsn + '/prestasi/' + updateID).remove();
                                    //     firebase.database().ref('siswa/' + updateID + '/file').remove();
                                    //     firebase.database().ref('siswa/' + updateID + '/fileDokPrestasi').remove();


                                    // } else {
                                    //     firebase.database().ref('siswa/' + updateID).update({
                                    //         status_daftar: true,
                                    //         status_skl: true,
                                    //         koreksi: koreksi,
                                    //     });
                                    // }
                                    // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                    // $("#modal_edit").modal('hide')
                                    // $("#alert-verif-warning").show(function () {
                                    //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                    //         $("#alert-verif-warning").slideUp(500);
                                    //     });
                                    // });
                                }
                                // document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                                // document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                                // document.getElementById("alamatEdit").value = values.alamat;

                            });
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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
    .controller('dataPendaftarPerpindahanCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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


        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })

        var cekBukaSiswaZonasi = firebase.database().ref('pengaturan').child('bukaSiswaZonasi');
        cekBukaSiswaZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaSiswaZonasi = dataSnapShot.val().aktif;
            console.log($scope.cekBukaSiswaZonasi);
        })
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
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }
        $scope.ranking_zonasi = function () {
            $state.go('dataRankingSekolahZonasi');
        }
        $scope.ranking_afirmasi = function () {
            $state.go('dataRankingSekolahAfirmasi');
        }
        $scope.ranking_perpindahan = function () {
            $state.go('dataRankingSekolahPerpindahan');
        }
        $scope.ranking_prestasi = function () {
            $state.go('dataRankingSekolahPrestasi');
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
                var pengguna = dbRef.ref('admin_sekolah');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sekolah').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "npsn": dataSnapShot.val().npsn,

                                };

                            })
                        });

                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }
                        // LOAD DATA PENDAFTAR
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan");
                        var listRef = $firebaseArray(ref);

                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            console.log(response);
                            $scope.siswa = response;

                            // var data;
                            // for (data in response) {
                            //     key1 = response[data].$id;
                            //     nisn = response[data].nisn;
                            //     status_uproveBaru =response[data].status_uprove2;
                            //     nama = response[data].nama
                            //     console.log(status_uproveBaru+ '' + nama);

                            //     if (status_uproveBaru == true && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + key1).update({
                            //             status_uprove2: true,
                            //             no_pendaftaran2 : 'perpindahan/2023/'+$scope.formData.npsn+'/'+nisn,
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: true,
                            //             })
                            //         })


                            //     } else if (status_uproveBaru == false && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + key1).update({
                            //             status_uprove2: false,
                            //             no_pendaftaran2 : 'perpindahan/2023/'+$scope.formData.npsn+'/'+nisn,
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: false,
                            //             })
                            //         })
                            //     }else if (status_uproveBaru == undefined && nama !=undefined ) {
                            //         console.log(key1 +" " +status_uproveBaru  )
                            //         firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + key1).update({
                            //             status_uprove2: false,
                            //             no_pendaftaran2 : 'perpindahan/2023/'+$scope.formData.npsn+'/'+nisn,
                            //         }).then(function (response) {
                            //             console.log('UPDATE SISWA');
                            //             firebase.database().ref("siswa/" + key1).update({
                            //                 status_uprove2: false,
                            //             })
                            //         })
                            //     }else {
                            //         console.log('SALAH');
                            //     }


                            // }

                            $ionicLoading.hide();
                        })

                        // $scope.formEdit = {
                        //     "jenjang": '',
                        //     "status": '',
                        //     "namaSekolah": '',
                        //     "idProvinsi": '',
                        //     "idKotaKabupaten": '',
                        //     "idKecamatan": '',
                        //     "alamatSekolah": '',
                        //     "npsn": '',
                        // }

                        //Verifikasi
                        var updateID = '';
                        $('body').on('click', '.verifikasiData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnVerif").value = values.nisn;
                                document.getElementById("nikVerif").value = values.nik;
                                document.getElementById("namaVerif").value = values.nama;
                                document.getElementById("alamatVerif").value = values.alamatzonasi;
                                document.getElementById("tglLahirVerif").value = values.tanggal_lahir;
                                // document.getElementById("jarakVerif").value = values.jarak;
                                document.getElementById("noSKLVerif").value = values.nomor_skl;
                                document.getElementById("nilaiSKLVerif").value = values.nilai_skl;

                                document.getElementById("sekolahAsal").value = values.sekolah_asal;


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
                                    const swalLogout = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-success ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalLogout.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin untuk memvalidasi?, data yang tervalidasi sudah dinyatakan benar & tidak dapat di batalkan atau di koreksi kembali',
                                        showCancelButton: true,
                                        confirmButtonText: 'Validasi',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            firebase.database().ref('siswa/' + updateID).update({
                                                status_uprove2: true,
                                            });

                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                                status_uprove2: true,
                                            });

                                            // UPDATE DATABASE RANKING PERPINDAHAN
                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan_rank/" + updateID).update({
                                                status_uprove2: true,
                                                finalPoin: values.finalPoin,
                                                id_sd: values.id_sd,
                                                // jalur: values.jalur,
                                                // jalurNama: values.jalurNama,
                                                jarak: values.jarak,
                                                nama: values.nama,
                                                nisn: values.nisn,
                                                // no_pendaftaran: values.no_pendaftaran,
                                                poinStatusKK: values.poinStatusKK,
                                                sekolah_asal: values.sekolah_asal,
                                                statusKK: values.statusKK,
                                                status_terima: values.status_terima,
                                                uid: values.uid

                                            });

                                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                                status_uprove2: true,
                                            });
                                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Sukses',
                                                text: 'Data Berhasil di Validasi',
                                            })
                                        }
                                    })

                                }

                                $scope.batalverifikasi_siswa = function () {

                                    firebase.database().ref('siswa/' + updateID).update({
                                        status_uprove2: false,
                                    });

                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                        status_uprove2: false,
                                    });

                                    // HAPUS DATA RANK ZONASI PADA DATABASE RANK ZONASI
                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan_rank/" + updateID).remove();

                                    firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                        status_uprove2: false,
                                    });
                                    // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Sukses',
                                        text: 'Validasi Berhasil Di Batalkan',
                                    })
                                }

                            });
                        });
                        firebase.database().ref('sekolah').child($scope.formData.npsn).on('value', (dataSnapShot1) => {

                            // $scope.kuotaAfirmasi = dataSnapShot1.val().kuota_afir;
                            $scope.namaSmp = dataSnapShot1.val().sekolah;

                        })
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-pendaftar-perpindahan'));
                            XLSX.writeFile(wb, "Pendaftar Perpindahan " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref('siswa/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;

                                var idSD = values.id_sd;
                                var idSMP = $scope.formData.npsn
                                var nama = values.nama;
                                $scope.status_daftar = values.status_daftar;
                                console.log($scope.status_daftar);
                                // if ($scope.status_daftar == true) {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // } else {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar' checked>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // }


                                $scope.simpan = function () {

                                    var chekdaftar = document.querySelector('.form-check-input').checked;
                                    var koreksi = document.getElementById("PesanKoreksi").value;

                                    // console.log(chekdaftar);
                                    // console.log(koreksi);
                                    if (koreksi != '') {
                                        console.log('JALAN');
                                        if (chekdaftar == true) {
                                            console.log('TesON')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            const swalLogout = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalLogout.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Apakah anda yakin ingin membuka akses ? , membuka akses akan membuat pendaftar harus mengulang kembali proses pendaftaran nya dari awal',
                                                showCancelButton: true,
                                                confirmButtonText: 'Buka Akses',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    console.log('EKSEKUSI');

                                                    firebase.database().ref('smp/' + $scope.formData.npsn + '/perpindahan/' + updateID).remove();
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        status_daftar: false,
                                                        status_daftarJalur: false,
                                                        status_terima: false,
                                                        status_uprove2: false,
                                                        koreksi: koreksi,
                                                    });

                                                    firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                                    // firebase.database().ref('siswa/' + updateID + '/fileDokPerpindahan').remove();
                                                } else {
                                                    console.log('BATAL');
                                                }
                                            })


                                        } else {
                                            console.log('TesOFF')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'Buka koreksi belum aktif, data tidak akan berubah',
                                                focusConfirm: false
                                            })
                                            // firebase.database().ref('siswa/' + updateID).update({
                                            //     status_daftar: true,
                                            //     status_skl: true,
                                            //     koreksi: koreksi,
                                            // });
                                        }
                                        // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                        // $("#modal_edit").modal('hide')
                                        // $("#alert-verif-warning").show(function () {
                                        //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                        //         $("#alert-verif-warning").slideUp(500);
                                        //     });
                                        // });
                                    } else {
                                        $("#modal_edit").find('form').trigger('reset');
                                        $("#modal_edit").modal('hide')
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Pesan koreksi tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }

                                    // if (chekdaftar == 'on') {


                                    // } else {
                                    //     firebase.database().ref('siswa/' + updateID).update({
                                    //         status_daftar: true,
                                    //         status_skl: true,
                                    //         koreksi: koreksi,
                                    //     });
                                    // }
                                    // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                    // $("#modal_edit").modal('hide')
                                    // $("#alert-verif-warning").show(function () {
                                    //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                    //         $("#alert-verif-warning").slideUp(500);
                                    //     });
                                    // });
                                }
                                // document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                                // document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                                // document.getElementById("alamatEdit").value = values.alamat;

                            });
                        });


                        //HAPUS
                        var id = '';
                        $("body").on('click', '.removeData', function () {
                            id = $(this).attr('data-id');
                            window.alert(id);
                            $scope.HapusDataPendaftar = function () {
                                // firebase.database().ref('admin_sekolah/' + id).remove();
                                console.log('click')
                                // window.alert("Data Berhasil Dihapus" + id);
                                // $("#modal_hapus").modal('hide');
                                // $("#alert-deleteAdminSMP-danger").show(function () {
                                //     $("#alert-deleteAdminSMP-danger").fadeTo(2000, 500).slideUp(500, function () {
                                //         $("#alert-deleteAdminSMP-danger").slideUp(500);
                                //     });
                                // });

                            }
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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
    .controller('dataPendaftarTersalurkanCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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


        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })

        var cekBukaSiswaZonasi = firebase.database().ref('pengaturan').child('bukaSiswaZonasi');
        cekBukaSiswaZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaSiswaZonasi = dataSnapShot.val().aktif;
            console.log($scope.cekBukaSiswaZonasi);
        })
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
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }
        $scope.ranking_zonasi = function () {
            $state.go('dataRankingSekolahZonasi');
        }
        $scope.ranking_afirmasi = function () {
            $state.go('dataRankingSekolahAfirmasi');
        }
        $scope.ranking_perpindahan = function () {
            $state.go('dataRankingSekolahPerpindahan');
        }
        $scope.ranking_prestasi = function () {
            $state.go('dataRankingSekolahPrestasi');
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
                var pengguna = dbRef.ref('admin_sekolah');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sekolah').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nip": dataSnapShot.val().nip,
                                    "nama": dataSnapShot.val().nama,
                                    "npsn": dataSnapShot.val().npsn,

                                };

                            })
                        });

                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }
                        // LOAD DATA PENDAFTAR
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/tersalurkan");
                        var listRef = $firebaseArray(ref);

                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            console.log(response);
                            $scope.siswa = response;
                            $ionicLoading.hide();
                        })

                        // $scope.formEdit = {
                        //     "jenjang": '',
                        //     "status": '',
                        //     "namaSekolah": '',
                        //     "idProvinsi": '',
                        //     "idKotaKabupaten": '',
                        //     "idKecamatan": '',
                        //     "alamatSekolah": '',
                        //     "npsn": '',
                        // }

                        //Verifikasi
                        var updateID = '';
                        $('body').on('click', '.verifikasiData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnVerif").value = values.nisn;
                                document.getElementById("nikVerif").value = values.nik;
                                document.getElementById("namaVerif").value = values.nama;
                                document.getElementById("alamatVerif").value = values.alamatzonasi;
                                document.getElementById("tglLahirVerif").value = values.tanggal_lahir;
                                // document.getElementById("jarakVerif").value = values.jarak;
                                document.getElementById("noSKLVerif").value = values.nomor_skl;
                                document.getElementById("nilaiSKLVerif").value = values.nilai_skl;

                                document.getElementById("sekolahAsal").value = values.sekolah_asal;


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
                                    const swalLogout = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-success ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalLogout.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin untuk memvalidasi?, data yang tervalidasi sudah dinyatakan benar & tidak dapat di batalkan atau di koreksi kembali',
                                        showCancelButton: true,
                                        confirmButtonText: 'Validasi',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            firebase.database().ref('siswa/' + updateID).update({
                                                status_uprove2: true,
                                            });

                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                                status_uprove2: true,
                                            });

                                            // UPDATE DATABASE RANKING PERPINDAHAN
                                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan_rank/" + updateID).update({
                                                status_uprove2: true,
                                                finalPoin: values.finalPoin,
                                                id_sd: values.id_sd,
                                                // jalur: values.jalur,
                                                // jalurNama: values.jalurNama,
                                                jarak: values.jarak,
                                                nama: values.nama,
                                                nisn: values.nisn,
                                                // no_pendaftaran: values.no_pendaftaran,
                                                poinStatusKK: values.poinStatusKK,
                                                sekolah_asal: values.sekolah_asal,
                                                statusKK: values.statusKK,
                                                status_terima: values.status_terima,
                                                uid: values.uid

                                            });

                                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                                status_uprove2: true,
                                            });
                                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Sukses',
                                                text: 'Data Berhasil di Validasi',
                                            })
                                        }
                                    })

                                }

                                $scope.batalverifikasi_siswa = function () {

                                    firebase.database().ref('siswa/' + updateID).update({
                                        status_uprove2: false,
                                    });

                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                        status_uprove2: false,
                                    });

                                    // HAPUS DATA RANK ZONASI PADA DATABASE RANK ZONASI
                                    firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan_rank/" + updateID).remove();

                                    firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                        status_uprove2: false,
                                    });
                                    // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Sukses',
                                        text: 'Validasi Berhasil Di Batalkan',
                                    })
                                }

                            });
                        });
                        firebase.database().ref('sekolah').child($scope.formData.npsn).on('value', (dataSnapShot1) => {

                            // $scope.kuotaAfirmasi = dataSnapShot1.val().kuota_afir;
                            $scope.namaSmp = dataSnapShot1.val().sekolah;

                        })
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-pendaftar-perpindahan'));
                            XLSX.writeFile(wb, "Pendaftar Perpindahan " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            // window.alert(updateID);
                            firebase.database().ref('siswa/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;

                                var idSD = values.id_sd;
                                var idSMP = $scope.formData.npsn
                                var nama = values.nama;
                                $scope.status_daftar = values.status_daftar;
                                console.log($scope.status_daftar);
                                // if ($scope.status_daftar == true) {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar'>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // } else {
                                //     document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                                //     <input type='checkbox' id='bukadaftar' checked>\
                                //     <span class='status roun'></span>\
                                //   </label>"
                                // }


                                $scope.simpan = function () {

                                    var chekdaftar = document.querySelector('.form-check-input').checked;
                                    var koreksi = document.getElementById("PesanKoreksi").value;

                                    // console.log(chekdaftar);
                                    // console.log(koreksi);
                                    if (koreksi != '') {
                                        console.log('JALAN');
                                        if (chekdaftar == true) {
                                            console.log('TesON')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            const swalLogout = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalLogout.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Apakah anda yakin ingin membuka akses ? , membuka akses akan membuat pendaftar harus mengulang kembali proses pendaftaran nya dari awal',
                                                showCancelButton: true,
                                                confirmButtonText: 'Buka Akses',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    console.log('EKSEKUSI');

                                                    firebase.database().ref('smp/' + $scope.formData.npsn + '/perpindahan/' + updateID).remove();
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        status_daftar: false,
                                                        status_daftarJalur: false,
                                                        status_terima: false,
                                                        status_uprove2: false,
                                                        koreksi: koreksi,
                                                    });

                                                    firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                                    // firebase.database().ref('siswa/' + updateID + '/fileDokPerpindahan').remove();
                                                } else {
                                                    console.log('BATAL');
                                                }
                                            })


                                        } else {
                                            console.log('TesOFF')
                                            $("#modal_edit").modal('hide')
                                            $("#modal_edit").find('form').trigger('reset');
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'Buka koreksi belum aktif, data tidak akan berubah',
                                                focusConfirm: false
                                            })
                                            // firebase.database().ref('siswa/' + updateID).update({
                                            //     status_daftar: true,
                                            //     status_skl: true,
                                            //     koreksi: koreksi,
                                            // });
                                        }
                                        // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                        // $("#modal_edit").modal('hide')
                                        // $("#alert-verif-warning").show(function () {
                                        //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                        //         $("#alert-verif-warning").slideUp(500);
                                        //     });
                                        // });
                                    } else {
                                        $("#modal_edit").find('form').trigger('reset');
                                        $("#modal_edit").modal('hide')
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Pesan koreksi tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }

                                    // if (chekdaftar == 'on') {


                                    // } else {
                                    //     firebase.database().ref('siswa/' + updateID).update({
                                    //         status_daftar: true,
                                    //         status_skl: true,
                                    //         koreksi: koreksi,
                                    //     });
                                    // }
                                    // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                                    // $("#modal_edit").modal('hide')
                                    // $("#alert-verif-warning").show(function () {
                                    //     $("#alert-verif-warning").fadeTo(2000, 500).slideUp(500, function () {
                                    //         $("#alert-verif-warning").slideUp(500);
                                    //     });
                                    // });
                                }
                                // document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                                // document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                                // document.getElementById("alamatEdit").value = values.alamat;

                            });
                        });


                        //HAPUS
                        var id = '';
                        $("body").on('click', '.removeData', function () {
                            id = $(this).attr('data-id');
                            window.alert(id);
                            $scope.HapusDataPendaftar = function () {
                                // firebase.database().ref('admin_sekolah/' + id).remove();
                                console.log('click')
                                // window.alert("Data Berhasil Dihapus" + id);
                                // $("#modal_hapus").modal('hide');
                                // $("#alert-deleteAdminSMP-danger").show(function () {
                                //     $("#alert-deleteAdminSMP-danger").fadeTo(2000, 500).slideUp(500, function () {
                                //         $("#alert-deleteAdminSMP-danger").slideUp(500);
                                //     });
                                // });

                            }
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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
