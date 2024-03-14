angular.module('app.siswaZonasi', [])

    .controller('siswaZonasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;

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
                                    "namaSekolah":dataSnapShot.val().namaSekolah

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
                        var ref = firebase.database().ref("datasiswa").orderByChild('idsekolah_zonasi').equalTo(String($scope.formData.npsn));
                        var listRef = $firebaseArray(ref);

                        $ionicLoading.show();
                        listRef.$loaded().then(function (response) {
                            $ionicLoading.hide();
                            $scope.siswa = response;
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
                            firebase.database().ref("datasiswa/" + updateID).on('value', function (snapshot) {
                                var values = snapshot.val();
                                document.getElementById("nisnVerif").value = values.nisn;
                                document.getElementById("nikVerif").value = values.nik;
                                document.getElementById("namaVerif").value = values.nama;
                                document.getElementById("alamatsiswaVerif").value = values.alamat;
                                document.getElementById("alamatVerif").value = values.kordinatzonasi;
                                document.getElementById("sekolahVerif").value = values.sekolah_asal;
                                document.getElementById("tglLahirVerif").value = values.tanggal_lahir;
                                document.getElementById("jarakVerif").value = values.jarak;
                                document.getElementById("noSKLVerif").value = values.nomor_skl;
                                document.getElementById("nilaiSKLVerif").value = values.nilai_skl;
                                document.getElementById("noKKVerif").value = values.noKK;
                                document.getElementById("statusKKVerif").value = values.statusKK;

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
                                var idSMP = values.sekolahZonasiId;


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
                                                    firebase.database().ref('siswa/' + updateID + '/file').remove();
                                                }else{
                                                    console.log('BATAL');
                                                }
                                            })


                                        } else {
                                            console.log('TesOFF')
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