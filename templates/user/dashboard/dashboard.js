angular.module('app.dashboard_user', [])

    .controller('dashboardCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $rootScope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var cekBukaPengumuman = firebase.database().ref('pengaturan').child('bukaPengumuman');
        cekBukaPengumuman.on('value', (dataSnapShot) => {
            $scope.cekBukaPengumuman = dataSnapShot.val().aktif;
        })
        var cekBukaPendaftaran = firebase.database().ref('pengaturan').child('bukaPendaftaran');
        cekBukaPendaftaran.on('value', (dataSnapShot) => {
            $scope.cekBukaPendaftaran = dataSnapShot.val().aktif;
        })
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
        $scope.logout = function () {
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
        $scope.checkScreen = function () {
            if ($(window).width() < 960) {
                $('.nav-pills, .nav-tabs').addClass('nav-fill')
            }
            else {
                $('.nav-pills, .nav-tabs').removeClass('nav-fill')
            }
        }
        $(window).resize(function () {
            $scope.checkScreen();
        });
        $scope.checkScreen();

        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light').removeClass('bg-light');
                $("#menu-toggle, .nav-link, .far.fa-envelope").addClass('text-light');
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
                $("#menu-toggle, .nav-link, .far.fa-envelope").removeClass('text-light');
                $(".nav-link ").removeClass('bg-dark');
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

        $scope.alertDashboardUser = function () {
            Swal.fire({
                icon: 'question',
                title: 'Selamat Datang',
                html:
                    '<div class="text-justify">Berikut Penjelasan singkat perihal <b>Tata Cara Pendaftaran </b> di sistem <b>e-PPDB</b>.' +
                    '<p>Proses Pendaftaran di bagi menjadi 2 Tahap</p> ' +
                    '<ol> <li> 1. Mengisi Data Diri & Upload Berkas</li>' +
                    '<li> 2. Pemilihan Jalur  </ol>' +
                    'Setelah Pengguna Memilih Jalur pada sekolah pilihan, data pendaftaran akan langsung masuk ke proses pemeriksaan oleh sekolah terkait. <br><br> ' +
                    'Setelah status data pendaftaran pengguna dinyatakan <b>SUDAH VALID</b>, proses pendaftaran pengguna sudah selesai. <br><br>' +
                    'Selanjutnya data pendaftaran pengguna akan di Ranking di Sekolah Terkait, jika lolos maka pengguna akan dapat dinyatakan terdaftar sebagai siswa di Sekolah Pilihan. <br><br>' +
                    'Jika Gagal Pengguna dapat mencoba mendaftar kembali di Jalur Lain.' +
                    'Sekian Penjelasan singkat perihal Alur Pendaftaran di Sistem <b>e-PPDB</b></div>',
                showCancelButton: true,
                confirmButtonText: 'Ok',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.localStorage.alertDashboardUser = "on";
                }
            })
        }
        $(document).ready(function () {
            if (window.localStorage.alertDashboardUser != "on") {
                $scope.alertDashboardUser();
            }
        });

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



        var cekBukaPPDB = firebase.database().ref('pengaturan').child('buka_ppdb');
        cekBukaPPDB.on('value', (dataSnapShot) => {
            $scope.cekBukaPPDB = dataSnapShot.val().aktif;
            console.log($scope.cekBukaPPDB);
            if ($scope.cekBukaPPDB == true) {
                console.log('PPDB DIBUKA')
            } else {
                firebase.auth().signOut();
            }
        })
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var useraktif = firebase.auth().currentUser;
                //console.log(useraktif.uid);
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('siswa/' + useraktif.uid);
                pengguna.on("value", function (snapshot) {
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            let firebaseRefKey = firebase.database().ref('siswa/' + useraktif.uid);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nisn": dataSnapShot.val().nisn,
                                    "nama": dataSnapShot.val().nama,
                                    "jalur": dataSnapShot.val().jalur,
                                    "jalur2": dataSnapShot.val().jalur2,
                                };

                                $scope.CheckPhoto = dataSnapShot.val().jenis_kelamin;
                                $scope.statusvalidasi = dataSnapShot.val().status_uprove;
                                $scope.statusvalidasi2 = dataSnapShot.val().status_uprove2;
                                $scope.statusdaftar = dataSnapShot.val().status_daftar;
                                $scope.statusdaftarZonasi = dataSnapShot.val().status_daftarZonasi;
                                $scope.statusdaftarJalur = dataSnapShot.val().status_daftarJalur;
                            })
                        });
                        $ionicLoading.hide();
                    } else {
                        //console.log("ID KOSONG");
                    }
                })
                // Notifikasi
                var ref = firebase.database().ref("notifikasi");
                var listRef = $firebaseArray(ref);

                listRef.$loaded().then(function (response) {
                    // console.log(response);
                    $scope.notifikasi = response;
                })
            }
            else {
                //console.log('TIDAK AKTIF');
                $('#modal_keluar').modal('hide');
                $state.go('welcome');
            }
            $scope.dashboard = function () {
                $state.go('dashboard');
            }
            $scope.pengumumanUser = function () {
                $state.go('pengumuman');
            }
            $scope.pengaturanUser = function () {
                $state.go('pengaturanUser');
            }
            $scope.pendaftaran_ppdb = function () {
                $ionicLoading.show();
                $state.go('pendaftaran_ppdb', {}, { reload: 'pendaftaran_ppdb' });
            }
            $scope.pendaftaran_kembali = function () {
                $ionicLoading.show();
                $state.go('pendaftaran_kembali');
            }

        });
    }])