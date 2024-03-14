angular.module('app.pengumumanuser', [])

    .controller('pengumumanCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-alterPass-danger").hide();

        $ionicLoading.show();
        //CEK STATUS PENGUMUMAN
        // let firebaseRefPengaturan = firebase.database().ref('pengaturan');
        // firebaseRefPengaturan.on('value', (dataSnapShot) => {
        //     $scope.statuspengumuman = dataSnapShot.val().buka_pengumuman;
        //     console.log($scope.statuspengumuman);

        //     // document.getElementById("daftar_nama_lengkap").value = dataSnapShot.val().nama;
        //     // document.getElementById("daftar_nisn").value = dataSnapShot.val().nisn;
        // })

        // var cekBukaPengumuman = firebase.database().ref('pengaturan').child('bukaPengumuman');
        // cekBukaPengumuman.on('value', (dataSnapShot) => {
        //     $scope.cekBukaPengumuman = dataSnapShot.val().aktif;
        // })

        // console.log($scope.cekBukaPengumuman);

        let cekBukaPengumuman = firebase.database().ref('pengaturan').child('bukaPengumuman');
        cekBukaPengumuman.on('value', (dataSnapShot) => {
            $scope.cekBukaPengumuman = {
                // "nip": dataSnapShot.val().nip,
                "aktif": dataSnapShot.val().aktif,
            };
            console.log($scope.cekBukaPengumuman.aktif);
        })
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
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                //console.log(useraktif.uid);
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('siswa/' + useraktif.uid);
                pengguna.on("value", function (snapshot) {
                    //console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            let firebaseRefKey = firebase.database().ref('siswa/' + useraktif.uid);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nisn": dataSnapShot.val().nisn,
                                    "nama": dataSnapShot.val().nama,
                                    "nik": dataSnapShot.val().nik,
                                    "id_sd": dataSnapShot.val().id_sd,
                                    "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                    "alamat": dataSnapShot.val().alamat,
                                    "tempat_lahir": dataSnapShot.val().tempat_lahir,
                                    "tanggal_lahir": dataSnapShot.val().tanggal_lahir,
                                    "idDesa": dataSnapShot.val().idDesa,
                                    "no_pendaftaran": dataSnapShot.val().no_pendaftaran,
                                    "no_pendaftaran2": dataSnapShot.val().no_pendaftaran2,
                                    "sekolahZonasi": dataSnapShot.val().sekolahZonasi,
                                    "sekolahJalur": dataSnapShot.val().sekolahJalur,
                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "jarak": dataSnapShot.val().jarak,
                                    "jalur": dataSnapShot.val().jalur,
                                    "jalurNama": dataSnapShot.val().jalurNama,
                                    "jalur2": dataSnapShot.val().jalur2,
                                    "jalurNama2": dataSnapShot.val().jalurNama2,
                                    "noKK": dataSnapShot.val().noKK,
                                    "nomor_skl": dataSnapShot.val().nomor_skl,
                                    "nilai_skl": dataSnapShot.val().nilai_skl,
                                    "status_penyaluran": dataSnapShot.val().status_penyaluran,


                                    "idKecamatan": dataSnapShot.val().idKecamatan,
                                    "namaKecamatan": dataSnapShot.val().namaKecamatan,
                                    "idDesa": dataSnapShot.val().idDesa,
                                    "namaDesa": dataSnapShot.val().namaDesa,
                                    "alamatzonasi": dataSnapShot.val().alamatzonasi,
                                    "koreksi": dataSnapShot.val().koreksi,
                                    "umur": dataSnapShot.val().umur,
                                    "umur_display": dataSnapShot.val().umur_display,
                                    "statusKK": dataSnapShot.val().statusKK,

                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "status_terima": dataSnapShot.val().status_terima,
                                    "status_terima2": dataSnapShot.val().status_terima2,

                                    "nomor_penyaluran": dataSnapShot.val().nomor_penyaluran,

                                };
                                $scope.CheckPhoto = dataSnapShot.val().jenis_kelamin;
                                $scope.statusvalidasi = dataSnapShot.val().status_uprove;
                                $scope.statusvalidasi2 = dataSnapShot.val().status_uprove2;
                                $scope.statusdaftar = dataSnapShot.val().status_daftar;
                                $scope.statusdaftarZonasi = dataSnapShot.val().status_daftarZonasi;
                                $scope.statusdaftarJalur = dataSnapShot.val().status_daftarJalur;
                                $scope.sekolahZonasi = dataSnapShot.val().sekolahZonasi;
                                $scope.sekolahJalur = dataSnapShot.val().sekolahJalur;
                                $scope.sekolahJalurId = dataSnapShot.val().sekolahJalurId;
                                // console.log($scope.sekolahJalurId );
                                $scope.sekolahZonasiId = dataSnapShot.val().sekolahZonasiId;
                                $scope.statusdaftarSwasta = dataSnapShot.val().pilihSwasta;
                                $scope.status_terima = dataSnapShot.val().status_terima;
                                $scope.status_terima2 = dataSnapShot.val().status_terima2;
                                $scope.status_penyaluran = dataSnapShot.val().status_penyaluran;
                                console.log($scope.status_terima);
                                $scope.status_terimaPenyaluran = dataSnapShot.val().status_terimaPenyaluran;
                                $scope.sekolahPenyaluran = dataSnapShot.val().sekolahPenyaluran;
                                
                                // document.getElementById("daftar_nama_lengkap").value = dataSnapShot.val().nama;
                                // document.getElementById("daftar_nisn").value = dataSnapShot.val().nisn;
                            })
                        });
                        $ionicLoading.hide();
                    } else {
                        //console.log("ID KOSONG");
                    }
                })
            }
            else {
                //console.log('TIDAK AKTIF')
            }
            $scope.test = function () {
                print();
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
            $scope.alter_pen = function () {
                var alter_pass = document.getElementById('alter_pass').value;
                console.log(alter_pass);
                if (alter_pass == "hesoyam") {
                    $('#modal_alter').modal('hide');
                    $state.go('pendaftaran_alter');
                } else {
                    $("#alert-alterPass-danger").show(function () {
                        $("#alert-alterPass-danger").fadeTo(2000, 500).slideUp(500, function () {
                            $("#alert-alterPass-danger").slideUp(500);
                        });
                    });
                }
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
        });
    }])