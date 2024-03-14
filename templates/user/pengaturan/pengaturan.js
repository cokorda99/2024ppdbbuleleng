angular.module('app.pengaturanuser', [])
    .controller('pengaturanUserCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $ionicLoading.show();
        //CEK STATUS USER
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
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //console.log('USER AKTIF');
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
                                    "jenis_kelamin": dataSnapShot.val().jenis_kelamin,
                                    "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                    "alamat": dataSnapShot.val().alamat,
                                    "tempat_lahir": dataSnapShot.val().tempat_lahir,
                                    "tanggal_lahir": dataSnapShot.val().tanggal_lahir,
                                    "jalur": dataSnapShot.val().jalur,
                                    "jalur2": dataSnapShot.val().jalur2,
                                };
                                $scope.CheckPhoto = dataSnapShot.val().jenis_kelamin;
                                $scope.statusvalidasi = dataSnapShot.val().status_uprove;
                                $scope.statusvalidasi2 = dataSnapShot.val().status_uprove2;
                                // document.getElementById("daftar_nama_lengkap").value = dataSnapShot.val().nama;
                                // document.getElementById("daftar_nisn").value = dataSnapShot.val().nisn;
                            })
                        });
                        $ionicLoading.hide();
                        $scope.simpan_perubahan = function () {
                            // $("#wrapper").toggleClass("toggled");
                            var edit_nama = document.getElementById("edit_nama_lengkap").value;
                            //console.log(edit_nama);
                            firebase.database().ref('siswa/' + useraktif.uid).update({
                                nama: edit_nama,
                            });
                            // window.alert('DATA BERHASIL DI UPDATE');
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil Di Update',
                                focusConfirm: false
                              })

                        }
                    } else {
                        //console.log("ID KOSONG");
                    }
                })
            }
            else {
                //console.log('TIDAK AKTIF')
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