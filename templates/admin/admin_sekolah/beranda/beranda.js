angular.module('app.brndAdminSekolah', [])

    .controller('berandaAdminSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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

        var disListRayon = document.getElementById('list-siswa-luar-rayon');
        var disCardRayon = document.getElementById('card-siswa-luar-rayon');

        $('#modal_pengumuman').modal('hide');
        $('#btn-data-ranking').on('click', function () {
            if ($('#btn-data-ranking').hasClass('selected')) {
                $('#btn-data-ranking').removeClass('selected');
            } else {
                $('#btn-data-ranking').addClass('selected');
            }

            // $('#btn-data-ranking').removeClass('selected');

        });
        // $( ".btn-data-ranking" ).click(function() {
        //     $( this ).toggleClass( "selected" );
        //     });
        var userID = $stateParams.idUser;

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
        $scope.data_luar_rayon = function () {
            $state.go('dataSiswaluarrayon');
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
                                                $scope.jumlahTotalPendaftar = totalPendaftarSpan;

                                                const ctx2 = document.getElementById('chart-jalur').getContext('2d');
                                                const myChart2 = new Chart(ctx2, {
                                                    type: 'bar',
                                                    data: {
                                                        labels: ['Zonasi', 'Afirmasi', 'Perpindahan', 'Prestasi'],
                                                        datasets: [{
                                                            label: 'Pendaftar',
                                                            data: [jmlZonasi, jmlAfrimasi, jmlPerpindahan, jmlPrestasi],
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

                                                // $('#total_pendaftarSpan').text(totalPendaftarSpan);
                                                // $('#spanJmlZonasi').text(jmlZonasi);
                                                // $('#spanJmlAfirmasi').text(jmlAfrimasi);
                                                // $('#spanJmlPrestasi').text(jmlPrestasi);
                                                // $('#spanJmlPerpindahan').text(jmlPerpindahan);
                                                // var ctx = document.getElementById('myChart').getContext('2d');
                                                // var myChart = new Chart(ctx, {
                                                //     type: 'pie',
                                                //     data: {
                                                //         labels: ['Zonasi ' + jmlZonasi, 'Afirmasi ' + jmlAfrimasi, 'Perpindahan ' + jmlPerpindahan, 'Prestasi ' + jmlPrestasi],
                                                //         datasets: [{
                                                //             data: [jmlZonasi, jmlAfrimasi, jmlPerpindahan, jmlPrestasi],
                                                //             backgroundColor: [
                                                //                 'rgba(255, 99, 132, 0.2)',
                                                //                 'rgba(54, 162, 235, 0.2)',
                                                //                 'rgba(255, 206, 86, 0.2)',
                                                //                 'rgba(75, 192, 192, 0.2)'
                                                //             ],
                                                //             borderColor: [
                                                //                 'rgba(255, 99, 132, 1)',
                                                //                 'rgba(54, 162, 235, 1)',
                                                //                 'rgba(255, 206, 86, 1)',
                                                //                 'rgba(75, 192, 192, 1)'
                                                //             ],
                                                //             borderWidth: 1
                                                //         }]
                                                //     },
                                                //     options: {
                                                //         scales: {
                                                //             y: {
                                                //                 beginAtZero: true
                                                //             }
                                                //         }
                                                //     }
                                                // });
                                            })
                                        })
                                    })
                                })


                                if ($scope.formData.npsn == '50100322' || $scope.formData.npsn == 50100322) {
                                    // LOAD JUMLAH TERSALURKAN
                                    var ref = firebase.database().ref("smp/" + $scope.formData.npsn + "/tersalurkan");
                                    var listRef = $firebaseArray(ref);

                                    $ionicLoading.show();
                                    listRef.$loaded().then(function (response) {
                                        $ionicLoading.hide();
                                        console.log(response.length);
                                        $scope.jumlahsiswatersalurkan = response.length;

                                    })
                                } else {
                                    console.log('Bukan Spensa')
                                }

                            })
                        });


                        var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        var npsnExc = ["50100335", "50100315", "50100334", "50100327", "50103917"];
                        var exc = npsnExc.includes($scope.formData.npsn);
                        if (exc) {
                            disListRayon.style.display = "block";
                            $scope.aksesTambah = true;
                        }
                        else {
                            console.log('TIDAK ADA AKSES');
                            $scope.aksesTambah = false;
                        }

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

                    console.log(namaSiswa.length)

                    if (namaSiswa.length != 0 && AlamatSiswa.length != 0 && npsnSiswa.length != 0 && NikSiswa.length != 0 && nisnSiswa.length != 0 && SekolahSiswa.length != 0 && tglLahirSiswa.length != 0 && tempatLahirSiswa.length != 0) {
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
                            create_by: $scope.formData.nama


                        }).then(function (resp) {
                            var ref = firebase.database().ref("smp/" + $scope.formData.npsn + '/datasiswa/' + nisnSiswa);
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
                                create_by: $scope.formData.nama


                            })
                        }).then(function (resp) {
                            $ionicLoading.hide();
                            window.alert('Upload Sukses');
                            document.getElementById("form-tambah-siswa-rayon").reset();
                            $("#modal_tambah").modal('hide');
                            $('.modal-backdrop').remove();
                            // $state.go("menuAdmin.dataSekolahAdmin")
                        })

                    }
                    else {
                        $ionicLoading.hide();
                        // window.alert('Data Belum Lengkap');
                        $("#alert-dataSiswa-warning").show(function () {
                            $("#alert-dataSiswa-warning").fadeTo(2000, 500).slideUp(500, function () {
                                $("#alert-dataSiswa-warning").slideUp(500);
                            });
                        });

                    }
                }
                // Notifikasi
                var ref = firebase.database().ref("notifikasi").orderByChild('penerima').equalTo(String('SMP'));
                var listRef = $firebaseArray(ref);

                listRef.$loaded().then(function (response) {
                    // console.log(response);
                    $scope.notifikasi = response;
                })
                // if(listRef>0){
                //     $('#accordion-button-1').removeClass('collapsed')
                //     $('panelsStayOpen-collapseOne').addClass('show')
                // }else{
                //     $('#accordion-button-1').addClass('collapsed')
                //     $('panelsStayOpen-collapseOne').removeClass('show')
                // }


            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }




        });

    }])