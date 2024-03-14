angular.module('app.dataRankingSekolah', [])

    .controller('dataRankingSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
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
                                })


                                // LOAD JUMLAH PENDAFTAR AFIRMASI
                                var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi");
                                var listRef = $firebaseArray(ref);

                                $ionicLoading.show();
                                listRef.$loaded().then(function (response) {
                                    $ionicLoading.hide();
                                    console.log(response.length);
                                    $scope.jumlahsiswaafirmasi = response.length;
                                })

                                // LOAD JUMLAH PENDAFTAR PRESTASI
                                var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi");
                                var listRef = $firebaseArray(ref);

                                $ionicLoading.show();
                                listRef.$loaded().then(function (response) {
                                    $ionicLoading.hide();
                                    console.log(response.length);
                                    $scope.jumlahsiswaprestasi = response.length;
                                })

                                // LOAD JUMLAH PENDAFTAR PERPINDAHAN
                                var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan");
                                var listRef = $firebaseArray(ref);

                                $ionicLoading.show();
                                listRef.$loaded().then(function (response) {
                                    $ionicLoading.hide();
                                    console.log(response.length);
                                    $scope.jumlahsiswaperpindahan = response.length;
                                })

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
    .controller('dataRankingSekolahZonasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        var userID = $stateParams.idUser;
        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })
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
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
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

        $scope.pendaftar_zonasi = function () {
            $state.go('dataPendaftarZonasi');
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
                        console.log($scope.formData.npsn)
                        let cekKuota = firebase.database().ref('sekolah').child($scope.formData.npsn);
                        cekKuota.on('value', (dataSnapShot) => {
                            $scope.formSekolah = {
                                "kuota": dataSnapShot.val().kuota,
                                "kuota_zonasi": dataSnapShot.val().kuota_zonasi,
                                "kuota_afirmasi": dataSnapShot.val().kuota_afirmasi,
                                "kuota_prestasi": dataSnapShot.val().kuota_prestasi,
                                "kuota_perpindahan": dataSnapShot.val().kuota_perpindahan,
                                "persentase_zonasi": dataSnapShot.val().persentase_zonasi,
                                "persentase_afirmasi": dataSnapShot.val().persentase_afirmasi,
                                "persentase_prestasi": dataSnapShot.val().persentase_prestasi,
                                "persentase_perpindahan": dataSnapShot.val().persentase_perpindahan,

                                "aksesEditRanking": dataSnapShot.val().aksesEditRanking,

                            };
                        })


                        // LOAD DATA PENDAFTAR
                        // var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi").orderByChild('status_uprove').equalTo(true);
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi_rank").orderByChild('finalPoin');
                        var listRef = $firebaseArray(ref);
                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            // console.log(response);
                            $scope.siswa = response;
                            $scope.jumlah_dataranking = response.length;
                            console.log($scope.jumlah_dataranking);
                            console.log($scope.formSekolah.kuota_zonasi);
                            console.log($scope.formSekolah.aksesEditRanking)

                            if ($scope.jumlah_dataranking == 0) {
                                $ionicLoading.hide();
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Perhatian',
                                    text: 'Belum ada pendaftar tervalidasi',
                                    focusConfirm: false
                                })
                            } else {
                                var data;
                                for (data in response) {
                                    if (response[data].nisn != undefined) {
                                        console.log(data);
                                        console.log(response[data]);
                                        if (data < $scope.formSekolah.kuota_zonasi) {
                                            console.log('DITERIMA')
                                        } else {
                                            console.log('WAITING')
                                        }
                                    } else {
                                        console.log('SKIP');
                                    }
                                    // key1 = response[data].$id;
                                    // nisn = response[data].nisn;
                                    // dobel = response[data].sekolahJalurID;
                                    // status_terimaJalur = response[data].status_terima2;
                                    // // console.log(key1);
                                    // poinKK = response[data].poinStatusKK;
                                    // tesjarak = response[data].jarak / 1000;
                                    $ionicLoading.hide()


                                    // if (condition) {

                                    // } else {

                                    // }

                                    // var data;
                                    // for (data in response) {
                                    //     // console.log(data);
                                    //     var index1 = data;
                                    //     // console.log(response[data].jarak);
                                    //     key1 = response[data].$id;
                                    //     nisn = response[data].nisn;
                                    //     // console.log(key1);

                                    //     poinKK = response[data].poinStatusKK
                                    //     tesjarak = response[data].jarak / 1000;

                                    //     console.log(data + ' ' + nisn + ' ' + key1);
                                    //     console.log($scope.formSekolah.kuota_zonasi);
                                    //     if (nisn != undefined) {
                                    //         // CEK NPSN SEKOLAH ZONASI SISWA 
                                    //         var dbRef = firebase.database();
                                    //         var ceksiswa = dbRef.ref('siswa/' + key1);
                                    //         ceksiswa.on("value", function (snapshot) {
                                    //             // console.log(snapshot.val().sekolahZonasiId);
                                    //             index = index + 1;
                                    //             // console.log(snapshot.val().nisn);
                                    //             // console.log(snapshot.val());
                                    //             console.log(snapshot.val().nisn);
                                    //             if (parseInt(index - 1) <= parseInt($scope.formSekolah.kuota_afirmasi)) {

                                    //                 firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + snapshot.val().uid).update({
                                    //                     status_terima2: true,
                                    //                 });
                                    //                 console.log('UPDATE SISWA TRUE');
                                    //                 firebase.database().ref("siswa/" + snapshot.val().uid).update({
                                    //                     status_terima2: true,
                                    //                 });
                                    //                 // console.log('UPDATE STATUS');
                                    //                 firebase.database().ref("smp/" + snapshot.val().sekolahZonasiId + "/zonasi/" + snapshot.val().uid).update({
                                    //                     finalPoin: snapshot.val().finalPoin,
                                    //                     finalPoin2: snapshot.val().finalPoin2,
                                    //                     jalur: "zonasi",
                                    //                     jalurNama: "Zonasi",
                                    //                     jarak: snapshot.val().jarak,
                                    //                     nama: snapshot.val().nama,
                                    //                     nisn: snapshot.val().nisn,
                                    //                     no_pendaftaran: snapshot.val().no_pendaftaran,
                                    //                     poinStatusKK: snapshot.val().poinStatusKK,
                                    //                     sekolah_asal: snapshot.val().sekolah_asal,
                                    //                     statusKK: snapshot.val().statusKK,
                                    //                     status_terima: false,
                                    //                     status_uprove: false,
                                    //                     status_terima2: true,
                                    //                     finalPoin3: '4.0',
                                    //                     sekolahJalurPilihan: $scope.formData.sekolah,
                                    //                     sekolahJalurID: $scope.formData.npsn,
                                    //                     namaJalurPilihan: 'Afirmasi',
                                    //                     uid: snapshot.val().uid,
                                    //                 })
                                    //                 // console.log('TRUE ',snapshot.val().uid);

                                    //             } else {

                                    //                 // console.log(key1)
                                    //                 firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + snapshot.val().uid).update({
                                    //                     status_terima2: false,
                                    //                     sekolahZonasiId: snapshot.val().sekolahZonasiId,
                                    //                     sekolahZonasi: snapshot.val().sekolahZonasi,
                                    //                 })
                                    //                 // console.log('UPDATE SISWA');
                                    //                 firebase.database().ref("siswa/" + snapshot.val().uid).update({
                                    //                     status_terima2: false,
                                    //                 })
                                    //                 console.log('UPDATE STATUS FALSE');
                                    //                 // console.log('FALSE '+snapshot.val().uid);
                                    //             }

                                    //         })
                                    //         // console.log(data.$scope.formSekolahID.zonasiID)
                                    //         // console.log(key1);
                                    //     } else {
                                    //         console.log('BUKAN DATA')
                                    //     }
                                }
                            }


                        })
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-rank-zonasi'));
                            XLSX.writeFile(wb, "Ranking Zonasi " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            console.log(updateID);
                            firebase.database().ref('smp/' + $scope.formData.npsn + '/zonasi_rank/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;
                                document.getElementById("finalPoinEdit").value = values.finalPoin;
                                console.log(values.finalPoin);
                                // console.log(String(values.finalPoin));
                                var nama = values.nama;
                                $scope.simpanEditFinalPoin = function () {
                                    $("#modal_edit").modal('hide');
                                    const swalsimpanFinalPoin = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalsimpanFinalPoin.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah yakin ingin mengubah Finalpoin ? , mengubah FinalPoin akan mengubah urutan siswa di ranking',
                                        showCancelButton: true,
                                        confirmButtonText: 'Ubah FinalPoin',
                                        reverseButtons: true
                                    }).then((result) => {

                                        if (result.isConfirmed) {
                                            console.log('KLIK')
                                            var finalPoinEdit = document.getElementById("finalPoinEdit").value;
                                            var finalPoinEditFix = parseFloat(finalPoinEdit)
                                            console.log(finalPoinEdit);
                                            if (finalPoinEdit == '') {
                                                //     console.log('Data tidak berubah')
                                                $("#modal_edit").modal('hide');
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Perhatian',
                                                    text: 'Data FinalPoin Tidak Boleh dikosongkan !!',
                                                })
                                            } else {
                                                if (finalPoinEditFix == values.finalPoin) {
                                                    console.log('Data tidak berubah')
                                                    $("#modal_edit").modal('hide');
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Data Tidak berubah',
                                                    })

                                                } else {
                                                    console.log('Data berubah')
                                                    console.log(parseFloat(finalPoinEdit));
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        finalPoin: finalPoinEditFix,
                                                    }).then(function () {
                                                        firebase.database().ref('smp/' + $scope.formData.npsn + '/zonasi_rank/' + updateID).update({
                                                            finalPoin: finalPoinEditFix,
                                                        }).then(function () {
                                                            $("#modal_edit").modal('hide');
                                                            Swal.fire({
                                                                icon: 'success',
                                                                title: 'Success',
                                                                text: 'Data Ranking Berhasil di update. Silahkan cek kembali urutan ranking siswa',
                                                            })
                                                        })
                                                    })
                                                }
                                            }


                                        } else {
                                            $("#modal_edit").modal('hide')
                                            console.log('CANCEL')
                                        }
                                    })

                                }

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
                $('#div-mulai-penerimaan').hide();
                var cekBukaPenerimaan = firebase.database().ref('pengaturan').child('buka_penerimaanSiswa');
                cekBukaPenerimaan.on('value', (dataSnapShot) => {
                    $scope.cekBukaPenerimaan = dataSnapShot.val().aktif;
                    if ($scope.cekBukaPenerimaan == true) {
                        $('#div-mulai-penerimaan').show();

                    } else {
                        $('#div-mulai-penerimaan').hide();
                    }
                })
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });


    }])
    .controller('dataRankingSekolahAfirmasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;
        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })
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
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
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
        $scope.pendaftar_afirmasi = function () {
            $state.go('dataPendaftarAfirmasi');
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
                                    "sekolah": dataSnapShot.val().namaSekolah,

                                };

                            })
                        });
                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }
                        // CEK KUOTA 
                        console.log($scope.formData.npsn)
                        let cekKuota = firebase.database().ref('sekolah').child($scope.formData.npsn);
                        cekKuota.on('value', (dataSnapShot) => {
                            $scope.formSekolah = {
                                "kuota": dataSnapShot.val().kuota,
                                "kuota_zonasi": dataSnapShot.val().kuota_zonasi,
                                "kuota_afirmasi": dataSnapShot.val().kuota_afirmasi,
                                "kuota_prestasi": dataSnapShot.val().kuota_prestasi,
                                "kuota_perpindahan": dataSnapShot.val().kuota_perpindahan,


                                "persentase_zonasi": dataSnapShot.val().persentase_zonasi,
                                "persentase_afirmasi": dataSnapShot.val().persentase_afirmasi,
                                "persentase_prestasi": dataSnapShot.val().persentase_prestasi,
                                "persentase_perpindahan": dataSnapShot.val().persentase_perpindahan,

                                "aksesEditRanking": dataSnapShot.val().aksesEditRanking,

                            };
                        })
                        // LOAD DATA PENDAFTAR
                        // var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi").orderByChild('status_uprove2').equalTo(true);
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi_rank").orderByChild('finalPoin');
                        var listRef = $firebaseArray(ref);
                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            // console.log(response);
                            $scope.siswa = response;
                            $scope.jumlah_dataranking = response.length;
                            console.log($scope.jumlah_dataranking);
                            console.log($scope.formSekolah.kuota_afirmasi);
                            console.log($scope.formSekolah.aksesEditRanking);

                            if ($scope.jumlah_dataranking == 0) {
                                $ionicLoading.hide();
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Perhatian',
                                    text: 'Belum ada pendaftar tervalidasi',
                                    focusConfirm: false
                                })
                            } else {
                                var data;
                                for (data in response) {
                                    if (response[data].nisn != undefined) {
                                        console.log(data);
                                        console.log(response[data]);
                                        if (data < $scope.formSekolah.kuota_afirmasi) {
                                            console.log('DITERIMA')
                                        } else {
                                            console.log('WAITING')
                                        }
                                    } else {
                                        console.log('SKIP');
                                    }
                                    $ionicLoading.hide()
                                }
                            }



                            // var data;
                            // for (data in response) {
                            //     // console.log(data);
                            //     var index1 = data;
                            //     // console.log(response[data].jarak);
                            //     key1 = response[data].$id;
                            //     nisn = response[data].nisn;
                            //     // console.log(key1);

                            //     poinKK = response[data].poinStatusKK
                            //     tesjarak = response[data].jarak / 1000;

                            //     console.log(data + ' ' + nisn + ' ' + key1);
                            //     console.log($scope.formSekolah.kuota_zonasi);
                            //     if (nisn != undefined) {
                            //         // CEK NPSN SEKOLAH ZONASI SISWA 
                            //         var dbRef = firebase.database();
                            //         var ceksiswa = dbRef.ref('siswa/' + key1);
                            //         ceksiswa.on("value", function (snapshot) {
                            //             // console.log(snapshot.val().sekolahZonasiId);
                            //             index = index + 1 ;
                            //             // console.log(snapshot.val().nisn);
                            //             // console.log(snapshot.val());
                            //             console.log(snapshot.val().nisn);
                            //             if (parseInt(index-1) <= parseInt($scope.formSekolah.kuota_afirmasi)) {

                            //                 firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + snapshot.val().uid).update({
                            //                     status_terima2: true,
                            //                 });
                            //                 console.log('UPDATE SISWA TRUE');
                            //                 firebase.database().ref("siswa/" + snapshot.val().uid).update({
                            //                     status_terima2: true,
                            //                 });
                            //                 // console.log('UPDATE STATUS');
                            //                 firebase.database().ref("smp/" + snapshot.val().sekolahZonasiId + "/zonasi/" + snapshot.val().uid).update({
                            //                     finalPoin: snapshot.val().finalPoin,
                            //                     finalPoin2: snapshot.val().finalPoin2,
                            //                     jalur: "zonasi",
                            //                     jalurNama: "Zonasi",
                            //                     jarak: snapshot.val().jarak,
                            //                     nama: snapshot.val().nama,
                            //                     nisn: snapshot.val().nisn,
                            //                     no_pendaftaran:snapshot.val().no_pendaftaran,
                            //                     poinStatusKK: snapshot.val().poinStatusKK,
                            //                     sekolah_asal: snapshot.val().sekolah_asal,
                            //                     statusKK: snapshot.val().statusKK,
                            //                     status_terima: false,
                            //                     status_uprove: false,
                            //                     status_terima2: true,
                            //                     finalPoin3: '4.0',
                            //                     sekolahJalurPilihan: $scope.formData.sekolah,
                            //                     sekolahJalurID : $scope.formData.npsn,
                            //                     namaJalurPilihan: 'Afirmasi',
                            //                     uid: snapshot.val().uid,
                            //                 })
                            //                 // console.log('TRUE ',snapshot.val().uid);

                            //             } else {

                            //                 // console.log(key1)
                            //                 firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + snapshot.val().uid).update({
                            //                     status_terima2: false,
                            //                     sekolahZonasiId : snapshot.val().sekolahZonasiId,
                            //                     sekolahZonasi : snapshot.val().sekolahZonasi,
                            //                 })
                            //                 // console.log('UPDATE SISWA');
                            //                 firebase.database().ref("siswa/" + snapshot.val().uid).update({
                            //                     status_terima2: false,
                            //                 })
                            //                 console.log('UPDATE STATUS FALSE');
                            //                 // console.log('FALSE '+snapshot.val().uid);
                            //             }

                            //         })
                            //         // console.log(data.$scope.formSekolahID.zonasiID)
                            //         // console.log(key1);
                            //     } else {
                            //         console.log('BUKAN DATA')
                            //     }
                            $ionicLoading.hide();
                            // }
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

                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-rank-afirmasi'));
                            XLSX.writeFile(wb, "Ranking Afirmasi " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            console.log(updateID);
                            firebase.database().ref('smp/' + $scope.formData.npsn + '/afirmasi_rank/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;
                                document.getElementById("finalPoinEdit").value = values.finalPoin;
                                console.log(values.finalPoin);
                                // console.log(String(values.finalPoin));
                                var nama = values.nama;
                                $scope.simpanEditFinalPoin = function () {
                                    $("#modal_edit").modal('hide');
                                    const swalsimpanFinalPoin = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalsimpanFinalPoin.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah yakin ingin mengubah Finalpoin ? , mengubah FinalPoin akan mengubah urutan siswa di ranking',
                                        showCancelButton: true,
                                        confirmButtonText: 'Ubah FinalPoin',
                                        reverseButtons: true
                                    }).then((result) => {

                                        if (result.isConfirmed) {
                                            console.log('KLIK')
                                            var finalPoinEdit = document.getElementById("finalPoinEdit").value;
                                            var finalPoinEditFix = parseFloat(finalPoinEdit)
                                            console.log(finalPoinEdit);
                                            if (finalPoinEdit == '') {
                                                //     console.log('Data tidak berubah')
                                                $("#modal_edit").modal('hide');
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Perhatian',
                                                    text: 'Data FinalPoin Tidak Boleh dikosongkan !!',
                                                })
                                            } else {
                                                if (finalPoinEditFix == values.finalPoin) {
                                                    console.log('Data tidak berubah')
                                                    $("#modal_edit").modal('hide');
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Data Tidak berubah',
                                                    })

                                                } else {
                                                    console.log('Data berubah')
                                                    console.log(parseFloat(finalPoinEdit));
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        finalPoin: finalPoinEditFix,
                                                    }).then(function () {
                                                        firebase.database().ref('smp/' + $scope.formData.npsn + '/afirmasi_rank/' + updateID).update({
                                                            finalPoin: finalPoinEditFix,
                                                        }).then(function () {
                                                            $("#modal_edit").modal('hide');
                                                            Swal.fire({
                                                                icon: 'success',
                                                                title: 'Success',
                                                                text: 'Data Ranking Berhasil di update. Silahkan cek kembali urutan ranking siswa',
                                                            })
                                                        })
                                                    })
                                                }
                                            }


                                        } else {
                                            $("#modal_edit").modal('hide')
                                            console.log('CANCEL')
                                        }
                                    })

                                }

                            });
                        });
                        // Batal Verifikasi
                        var updateID = '';
                        $('body').on('click', '.batalData', function () {
                            updateID = $(this).attr('data-id');
                            console.log(updateID);
                            firebase.database().ref('siswa/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnBatal").value = values.nisn;
                                document.getElementById("nikBatal").value = values.nik;
                                document.getElementById("namaBatal").value = values.nama;
                                document.getElementById("alamatBatal").value = values.alamat;

                                var nama = values.nama

                                $scope.status_verif = values.status_uprove;
                                console.log($scope.status_verif)
                                if ($scope.status_verif == true) {
                                    document.getElementById("verifBatal").value = 'SUDAH';
                                } else {
                                    document.getElementById("verifBatal").value = 'BELUM';
                                }

                                $scope.verifikasi_siswa = function () {

                                    firebase.database().ref('siswa/' + updateID).update({
                                        status_uprove: false,
                                    });
                                    window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                                    $("#modal_batal").modal('hide')
                                }

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
                $('#div-mulai-penerimaan').hide();
                var cekBukaPenerimaan = firebase.database().ref('pengaturan').child('buka_penerimaanSiswa');
                cekBukaPenerimaan.on('value', (dataSnapShot) => {
                    $scope.cekBukaPenerimaan = dataSnapShot.val().aktif;
                    if ($scope.cekBukaPenerimaan == true) {
                        $('#div-mulai-penerimaan').show();

                    } else {
                        $('#div-mulai-penerimaan').hide();
                    }
                })
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
    .controller('dataRankingSekolahPrestasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


        var userID = $stateParams.idUser;
        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })
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
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
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
        $scope.pendaftar_prestasi = function () {
            $state.go('dataPendaftarPrestasi');
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
                                    "sekolah": dataSnapShot.val().namaSekolah,
                                };

                            })
                        });
                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }

                        console.log($scope.formData.npsn)
                        let cekKuota = firebase.database().ref('sekolah').child($scope.formData.npsn);
                        cekKuota.on('value', (dataSnapShot) => {
                            $scope.formSekolah = {
                                "kuota": dataSnapShot.val().kuota,
                                "kuota_zonasi": dataSnapShot.val().kuota_zonasi,
                                "kuota_afirmasi": dataSnapShot.val().kuota_afirmasi,
                                "kuota_prestasi": dataSnapShot.val().kuota_prestasi,
                                "kuota_perpindahan": dataSnapShot.val().kuota_perpindahan,


                                "persentase_zonasi": dataSnapShot.val().persentase_zonasi,
                                "persentase_afirmasi": dataSnapShot.val().persentase_afirmasi,
                                "persentase_prestasi": dataSnapShot.val().persentase_prestasi,
                                "persentase_perpindahan": dataSnapShot.val().persentase_perpindahan,

                                "aksesEditRanking": dataSnapShot.val().aksesEditRanking,

                            };
                        })

                        // LOAD DATA PENDAFTAR
                        // var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi").orderByChild('poinPrestasi2');
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi_rank").orderByChild('poinPrestasi');
                        var listRef = $firebaseArray(ref);
                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            $scope.siswa = response;
                            $scope.jumlah_dataranking = response.length;
                            console.log($scope.jumlah_dataranking);
                            console.log($scope.formSekolah.kuota_prestasi);
                            console.log($scope.formSekolah.aksesEditRanking);

                            if ($scope.jumlah_dataranking == 0) {
                                $ionicLoading.hide();
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Perhatian',
                                    text: 'Belum ada pendaftar tervalidasi',
                                    focusConfirm: false
                                })
                            } else {
                                var data;
                                for (data in response) {
                                    if (response[data].nisn != undefined) {
                                        // console.log(data);
                                        // console.log(response[data].nisn);
                                        if (data < $scope.formSekolah.kuota_prestasi) {
                                            console.log(response[data].nisn +' DITERIMA')
                                        } else {
                                            console.log(response[data].nisn + ' WAITING')
                                        }
                                    } else {
                                        console.log('SKIP');
                                    }
                                    $ionicLoading.hide()
                                }
                            }

                        })
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-rank-prestasi'));
                            XLSX.writeFile(wb, "Ranking Prestasi " + $scope.namaSmp + ".xlsx");
                        }

                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            console.log(updateID);
                            firebase.database().ref('smp/' + $scope.formData.npsn + '/prestasi_rank/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;
                                document.getElementById("finalPoinEdit").value = values.finalPoin;
                                document.getElementById("poinPrestasiEdit").value = values.poinPrestasi;
                                console.log(values.finalPoin);
                                // console.log(String(values.finalPoin));
                                var nama = values.nama;
                                $scope.simpanEditFinalPoin = function () {
                                    $("#modal_edit").modal('hide');
                                    const swalsimpanFinalPoin = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalsimpanFinalPoin.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah yakin ingin mengubah Poin Prestasi ? , mengubah Poin Prestasi akan mengubah urutan siswa di ranking',
                                        showCancelButton: true,
                                        confirmButtonText: 'Ubah Poin Prestasi',
                                        reverseButtons: true
                                    }).then((result) => {

                                        if (result.isConfirmed) {
                                            console.log('KLIK')
                                            var poinPrestasiEdit = document.getElementById("poinPrestasiEdit").value;
                                            var poinPrestasiEditFix = parseFloat(poinPrestasiEdit)
                                            console.log(poinPrestasiEdit);
                                            if (poinPrestasiEdit == '') {
                                                //     console.log('Data tidak berubah')
                                                $("#modal_edit").modal('hide');
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Perhatian',
                                                    text: 'Data FinalPoin Tidak Boleh dikosongkan !!',
                                                })
                                            } else {
                                                if (poinPrestasiEditFix == values.poinPrestasi) {
                                                    console.log('Data tidak berubah')
                                                    $("#modal_edit").modal('hide');
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Data Tidak berubah',
                                                    })

                                                } else {
                                                    console.log('Data berubah')
                                                    console.log(parseFloat(poinPrestasiEdit));
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        poinPrestasi: poinPrestasiEditFix,
                                                    }).then(function () {
                                                        firebase.database().ref('smp/' + $scope.formData.npsn + '/prestasi_rank/' + updateID).update({
                                                            poinPrestasi: poinPrestasiEditFix,
                                                        }).then(function () {
                                                            $("#modal_edit").modal('hide');
                                                            Swal.fire({
                                                                icon: 'success',
                                                                title: 'Success',
                                                                text: 'Data Ranking Berhasil di update. Silahkan cek kembali urutan ranking siswa',
                                                            })
                                                        })
                                                    })
                                                }
                                            }


                                        } else {
                                            $("#modal_edit").modal('hide')
                                            console.log('CANCEL')
                                        }
                                    })

                                }

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
                $('#div-mulai-penerimaan').hide();
                var cekBukaPenerimaan = firebase.database().ref('pengaturan').child('buka_penerimaanSiswa');
                cekBukaPenerimaan.on('value', (dataSnapShot) => {
                    $scope.cekBukaPenerimaan = dataSnapShot.val().aktif;
                    if ($scope.cekBukaPenerimaan == true) {
                        $('#div-mulai-penerimaan').show();

                    } else {
                        $('#div-mulai-penerimaan').hide();
                    }
                })
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
    .controller('dataRankingSekolahPerpindahanCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


        var userID = $stateParams.idUser;
        var cekBukaRanking = firebase.database().ref('pengaturan').child('bukaPerankingan');
        cekBukaRanking.on('value', (dataSnapShot) => {
            $scope.cekBukaRanking = dataSnapShot.val().aktif;
            console.log($scope.cekBukaRanking);
            if ($scope.cekBukaRanking == true) {
                console.log('PENDAFTARAN DIBUKA')
            }
        })
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
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            } else {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
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
        $scope.pendaftar_perpindahan = function () {
            $state.go('dataPendaftarPerpindahan');
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
                                    "sekolah": dataSnapShot.val().namaSekolah,
                                };

                            })
                        });
                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }

                        // CEK KUOTA 
                        console.log($scope.formData.npsn)
                        let cekKuota = firebase.database().ref('sekolah').child($scope.formData.npsn);
                        cekKuota.on('value', (dataSnapShot) => {
                            $scope.formSekolah = {
                                "kuota": dataSnapShot.val().kuota,
                                "kuota_zonasi": dataSnapShot.val().kuota_zonasi,
                                "kuota_afirmasi": dataSnapShot.val().kuota_afirmasi,
                                "kuota_prestasi": dataSnapShot.val().kuota_prestasi,
                                "kuota_perpindahan": dataSnapShot.val().kuota_perpindahan,
                                "persentase_zonasi": dataSnapShot.val().persentase_zonasi,
                                "persentase_afirmasi": dataSnapShot.val().persentase_afirmasi,
                                "persentase_prestasi": dataSnapShot.val().persentase_prestasi,
                                "persentase_perpindahan": dataSnapShot.val().persentase_perpindahan,

                                "aksesEditRanking": dataSnapShot.val().aksesEditRanking,

                            };
                        })
                        // LOAD DATA PENDAFTAR
                        // var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan").orderByChild('status_uprove2').equalTo(true);
                        var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan_rank").orderByChild('finalPoin');
                        var listRef = $firebaseArray(ref);
                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            // console.log(response);
                            $scope.siswa = response;
                            $scope.jumlah_dataranking = response.length;
                            console.log($scope.jumlah_dataranking);
                            console.log($scope.formSekolah.kuota_perpindahan);
                            console.log($scope.formSekolah.aksesEditRanking);

                            if ($scope.jumlah_dataranking == 0) {
                                $ionicLoading.hide();
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Perhatian',
                                    text: 'Belum ada pendaftar tervalidasi',
                                    focusConfirm: false
                                })
                            } else {
                                var data;
                                for (data in response) {
                                    if (response[data].nisn != undefined) {
                                        console.log(data);
                                        console.log(response[data]);
                                        if (data < $scope.formSekolah.kuota_perpindahan) {
                                            console.log('DITERIMA')
                                        } else {
                                            console.log('WAITING')
                                        }
                                    } else {
                                        console.log('SKIP');
                                    }
                                    $ionicLoading.hide()
                                }
                            }


                            // var data;
                            // for (data in response) {

                            //     var index1 = data;
                            //     // console.log(response[data].jarak);
                            //     key1 = response[data].$id;
                            //     nisn = response[data].nisn;
                            //     // console.log(key1);

                            //     poinKK = response[data].poinStatusKK
                            //     tesjarak = response[data].jarak / 1000;

                            //     console.log(data + ' ' + nisn);
                            //     console.log(data + ' ' + nisn + ' ' + key1);
                            //     console.log($scope.formSekolah.kuota_zonasi);
                            //     if (nisn != undefined) {
                            //         // CEK NPSN SEKOLAH ZONASI SISWA 
                            //         var dbRef = firebase.database();
                            //         var ceksiswa = dbRef.ref('siswa/' + key1);
                            //         ceksiswa.on("value", function (snapshot) {
                            //             // console.log(snapshot.val().sekolahZonasiId);
                            //             index = index + 1 ;
                            //             // console.log(snapshot.val().nisn);
                            //             // console.log(snapshot.val());
                            //             // console.log(index);
                            //             if (parseInt(index-1) <= parseInt($scope.formSekolah.kuota_perpindahan)) {

                            //                 firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + snapshot.val().uid).update({
                            //                     status_terima2: true,
                            //                 });
                            //                 // console.log('UPDATE SISWA TRUE');
                            //                 firebase.database().ref("siswa/" + snapshot.val().uid).update({
                            //                     status_terima2: true,
                            //                 });
                            //                 // console.log('UPDATE STATUS');
                            //                 firebase.database().ref("smp/" + snapshot.val().sekolahZonasiId + "/zonasi/" + snapshot.val().uid).update({
                            //                     finalPoin: snapshot.val().finalPoin,
                            //                     finalPoin2: snapshot.val().finalPoin2,
                            //                     jalur: "zonasi",
                            //                     jalurNama: "Zonasi",
                            //                     jarak: snapshot.val().jarak,
                            //                     nama: snapshot.val().nama,
                            //                     nisn: snapshot.val().nisn,
                            //                     no_pendaftaran:snapshot.val().no_pendaftaran,
                            //                     poinStatusKK: snapshot.val().poinStatusKK,
                            //                     sekolah_asal: snapshot.val().sekolah_asal,
                            //                     statusKK: snapshot.val().statusKK,
                            //                     status_terima: false,
                            //                     status_uprove: false,
                            //                     status_terima2: true,
                            //                     finalPoin3: '4.0',
                            //                     sekolahJalurPilihan: $scope.formData.sekolah,
                            //                     sekolahJalurID : $scope.formData.npsn,
                            //                     namaJalurPilihan: 'Perpindahan',
                            //                     uid: snapshot.val().uid,
                            //                 })
                            //                 console.log('TRUE ',snapshot.val().nisn);

                            //             } else {

                            //                 // console.log(key1)
                            //                 firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + snapshot.val().uid).update({
                            //                     status_terima2: false,
                            //                     sekolahZonasiId : snapshot.val().sekolahZonasiId,
                            //                     sekolahZonasi : snapshot.val().sekolahZonasi,
                            //                 })
                            //                 // console.log('UPDATE SISWA');
                            //                 firebase.database().ref("siswa/" + snapshot.val().uid).update({
                            //                     status_terima2: false,
                            //                 })
                            //                 // console.log('UPDATE STATUS');
                            //                 console.log('FALSE '+snapshot.val().nisn);
                            //             }

                            //         })
                            //         // console.log(data.$scope.formSekolahID.zonasiID)
                            //         // console.log(key1);
                            //     } else {
                            //         console.log('BUKAN DATA')
                            //     }
                            $ionicLoading.hide();
                            // }


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
                        $scope.cetak = function () {
                            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-rank-perpindahan'));
                            XLSX.writeFile(wb, "Ranking Perpindahan " + $scope.namaSmp + ".xlsx");
                        }
                        //UPDATE
                        var updateID = '';
                        $('body').on('click', '.updateData', function () {
                            updateID = $(this).attr('data-id');
                            console.log(updateID);
                            firebase.database().ref('smp/' + $scope.formData.npsn + '/perpindahan_rank/' + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nopEdit").value = values.no_pendaftaran2;
                                document.getElementById("nisnEdit").value = values.nisn;
                                document.getElementById("namaEdit").value = values.nama;
                                document.getElementById("finalPoinEdit").value = values.finalPoin;
                                console.log(values.finalPoin);
                                // console.log(String(values.finalPoin));
                                var nama = values.nama;
                                $scope.simpanEditFinalPoin = function () {
                                    $("#modal_edit").modal('hide');
                                    const swalsimpanFinalPoin = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalsimpanFinalPoin.fire({
                                        title: 'Perhatian',
                                        icon: 'warning',
                                        text: 'Apakah yakin ingin mengubah Finalpoin ? , mengubah FinalPoin akan mengubah urutan siswa di ranking',
                                        showCancelButton: true,
                                        confirmButtonText: 'Ubah FinalPoin',
                                        reverseButtons: true
                                    }).then((result) => {

                                        if (result.isConfirmed) {
                                            console.log('KLIK')
                                            var finalPoinEdit = document.getElementById("finalPoinEdit").value;
                                            var finalPoinEditFix = parseFloat(finalPoinEdit)
                                            console.log(finalPoinEdit);
                                            if (finalPoinEdit == '') {
                                                //     console.log('Data tidak berubah')
                                                $("#modal_edit").modal('hide');
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Perhatian',
                                                    text: 'Data FinalPoin Tidak Boleh dikosongkan !!',
                                                })
                                            } else {
                                                if (finalPoinEditFix == values.finalPoin) {
                                                    console.log('Data tidak berubah')
                                                    $("#modal_edit").modal('hide');
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Data Tidak berubah',
                                                    })

                                                } else {
                                                    console.log('Data berubah')
                                                    console.log(parseFloat(finalPoinEdit));
                                                    firebase.database().ref('siswa/' + updateID).update({
                                                        finalPoin: finalPoinEditFix,
                                                    }).then(function () {
                                                        firebase.database().ref('smp/' + $scope.formData.npsn + '/perpindahan_rank/' + updateID).update({
                                                            finalPoin: finalPoinEditFix,
                                                        }).then(function () {
                                                            $("#modal_edit").modal('hide');
                                                            Swal.fire({
                                                                icon: 'success',
                                                                title: 'Success',
                                                                text: 'Data Ranking Berhasil di update. Silahkan cek kembali urutan ranking siswa',
                                                            })
                                                        })
                                                    })
                                                }
                                            }


                                        } else {
                                            $("#modal_edit").modal('hide')
                                            console.log('CANCEL')
                                        }
                                    })

                                }

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
                $('#div-mulai-penerimaan').hide();
                var cekBukaPenerimaan = firebase.database().ref('pengaturan').child('buka_penerimaanSiswa');
                cekBukaPenerimaan.on('value', (dataSnapShot) => {
                    $scope.cekBukaPenerimaan = dataSnapShot.val().aktif;
                    if ($scope.cekBukaPenerimaan == true) {
                        $('#div-mulai-penerimaan').show();

                    } else {
                        $('#div-mulai-penerimaan').hide();
                    }
                })
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

    }])
