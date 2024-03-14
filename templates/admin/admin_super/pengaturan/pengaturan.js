angular.module('app.pengaturanAdminSuper', [])

    .controller('pengaturanAdminSuperCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
                $("#wrapper, .navbar, #nav-flex").addClass('bg-night').removeClass('bg-light');
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
                                    "email": dataSnapShot.val().email,
                                    "password": dataSnapShot.val().passwordDisplay,
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


                // PENGATURAN ON/OFF JALUR PENDAFTARAN
                // PENDAFTARAN
                let firebaseRefPendaftaran = firebase.database().ref('pengaturan').child('bukaPendaftaran');
                firebaseRefPendaftaran.on('value', (dataSnapShot) => {
                    $scope.status_pendaftaran = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };
                    console.log($scope.status_pendaftaran.aktif)
                    document.getElementById("Status_Pendaftaran").value = $scope.status_pendaftaran.aktif;
                })

                // PENGUMUMAN
                let firebaseRefPengumuman = firebase.database().ref('pengaturan').child('bukaPengumuman');
                firebaseRefPengumuman.on('value', (dataSnapShot) => {
                    $scope.status_pengumuman = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };

                    console.log($scope.status_pengumuman.aktif)
                    document.getElementById("Status_Pengumuman").value = $scope.status_pengumuman.aktif;
                })

                // PENYALURAN
                let firebaseRefPenyaluran = firebase.database().ref('pengaturan').child('bukaPenyaluran');
                firebaseRefPenyaluran.on('value', (dataSnapShot) => {
                    $scope.status_penyaluran = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };
                    console.log($scope.status_penyaluran.aktif)
                    document.getElementById("Status_Penyaluran").value = $scope.status_penyaluran.aktif;
                })

                // ZONASI
                let firebaseRefZonasi = firebase.database().ref('pengaturan').child('buka_jalurZonasi');
                firebaseRefZonasi.on('value', (dataSnapShot) => {
                    $scope.status_zonasi = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };

                    console.log($scope.status_zonasi.aktif)
                    document.getElementById("status_JalurZonasi").value = $scope.status_zonasi.aktif;
                })

                // AFIRMASI
                let firebaseRefAfirmasi = firebase.database().ref('pengaturan').child('buka_jalurAfirmasi');
                firebaseRefAfirmasi.on('value', (dataSnapShot) => {
                    $scope.status_afirmasi = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };

                    console.log($scope.status_afirmasi.aktif)
                    document.getElementById("status_JalurAfirmasi").value = $scope.status_afirmasi.aktif;
                })

                // PERPINDAHAN
                let firebaseRefPerpindahan = firebase.database().ref('pengaturan').child('buka_jalurPerpindahan');
                firebaseRefPerpindahan.on('value', (dataSnapShot) => {
                    $scope.status_perpindahan = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };

                    console.log($scope.status_perpindahan.aktif);
                    document.getElementById("status_JalurPerpindahan").value = $scope.status_perpindahan.aktif;
                })

                // PRESTASI
                let firebaseRefPrestasi = firebase.database().ref('pengaturan').child('buka_jalurPrestasi');
                firebaseRefPrestasi.on('value', (dataSnapShot) => {
                    $scope.status_prestasi = {
                        // "nip": dataSnapShot.val().nip,
                        "aktif": dataSnapShot.val().aktif,
                    };

                    console.log($scope.status_prestasi.aktif)
                    document.getElementById("status_JalurPrestasi").value = $scope.status_prestasi.aktif;
                })

                $scope.simpan_pengaturan = function () {
                    $ionicLoading.show();
                    var status_pendaftaran = document.getElementById("Status_Pendaftaran").value;
                    var status_pengumuman = document.getElementById("Status_Pengumuman").value;
                    var status_penyaluran = document.getElementById("Status_Penyaluran").value;

                    var status_zonasi = document.getElementById("status_JalurZonasi").value;
                    var status_afirmasi = document.getElementById("status_JalurAfirmasi").value;
                    var status_perpindahan = document.getElementById("status_JalurPerpindahan").value;
                    var status_prestasi = document.getElementById("status_JalurPrestasi").value;

                    var statusPendaftaranFix;
                    var statusPengumumanFix;
                    var statusPenyaluranFix;

                    var statusZonasiFix;
                    var statusAfirmasiFix;
                    var statusPerpindahanFix;
                    var statusPrestasiFix;

                    if (status_pendaftaran == "true") {
                        statusPendaftaranFix = true;
                    } else {
                        statusPendaftaranFix = false;
                    }

                    if (status_pengumuman == "true") {
                        statusPengumumanFix = true;
                    } else {
                        statusPengumumanFix = false;
                    }

                    if (status_penyaluran == "true") {
                        statusPenyaluranFix = true;
                    } else {
                        statusPenyaluranFix = false;
                    }

                    if (status_zonasi == "true") {
                        statusZonasiFix = true;
                    } else {
                        statusZonasiFix = false;
                    }

                    if (status_afirmasi == "true") {
                        statusAfirmasiFix = true;
                    } else {
                        statusAfirmasiFix = false;
                    }
                    if (status_perpindahan == "true") {
                        statusPerpindahanFix = true;
                    } else {
                        statusPerpindahanFix = false;
                    }
                    if (status_prestasi == "true") {
                        statusPrestasiFix = true;
                    } else {
                        statusPrestasiFix = false;
                    }

                    firebase.database().ref('pengaturan/bukaPendaftaran').update({
                        aktif: statusPendaftaranFix,
                    }).then(function (response) {
                        firebase.database().ref('pengaturan/bukaPengumuman').update({
                            aktif: statusPengumumanFix,
                        }).then(function (response) {
                            firebase.database().ref('pengaturan/bukaPenyaluran').update({
                                aktif: statusPenyaluranFix,
                            }).then(function (response) {
                                firebase.database().ref('pengaturan/buka_jalurZonasi').update({
                                    aktif: statusZonasiFix,
                                }).then(function (response) {
                                    firebase.database().ref('pengaturan/buka_jalurAfirmasi').update({
                                        aktif: statusAfirmasiFix,
                                    }).then(function (response) {
                                        firebase.database().ref('pengaturan/buka_jalurPerpindahan').update({
                                            aktif: statusPerpindahanFix,
                                        }).then(function (response) {
                                            firebase.database().ref('pengaturan/buka_jalurPrestasi').update({
                                                aktif: statusPrestasiFix,
                                            }).then(function (response) {
                                                $ionicLoading.hide();
                                                Swal.fire({
                                                    icon: 'success',
                                                    title: 'Sukses',
                                                    text: 'Data Berhasil di Update',
                                                })
                                            });
                                        });
                                    })
                                });
                            })
                        });
                    });
                }


                // $("#Status_Pendaftaran").change(function(){
                //     var selValue = document.getElementById("Status_Pendaftaran").value
                //     if(selValue=='false'){
                //         $("#status_JalurZonasi, #status_JalurAfirmasi, #status_JalurAfirmasi, #status_JalurPerpindahan, #status_JalurPrestasi"). prop('disabled', true);
                //     }else{
                //         $("#status_JalurZonasi, #statusJalurAfirmasi, #status_JalurPerpindahan, #status_JalurPrestasi"). prop('disabled', false);
                //     }

                // });



                // console.log(status_pendaftaran);
                // if (status_pendaftaran == "true" && status_pengumuman == "true") {
                //     firebase.database().ref('pengaturan/bukaPendaftaran').update({
                //         aktif: true,
                //     })
                //         .then(function (response) {
                //             firebase.database().ref('pengaturan/bukaPengumuman').update({
                //                 aktif: true,
                //             }).then(function (response) {
                //                 Swal.fire({
                //                     icon: 'success',
                //                     title: 'Perhatian',
                //                     text: 'UPDATE BERHASIL',
                //                     focusConfirm: false
                //                 })
                //             });
                //         });
                // } else if (status_pendaftaran == "true" && status_pengumuman == "false") {
                //     firebase.database().ref('pengaturan/bukaPendaftaran').update({
                //         aktif: true,
                //     })
                //         .then(function (response) {
                //             firebase.database().ref('pengaturan/bukaPengumuman').update({
                //                 aktif: false,
                //             }).then(function (response) {
                //                 Swal.fire({
                //                     icon: 'success',
                //                     title: 'Perhatian',
                //                     text: 'UPDATE BERHASIL',
                //                     focusConfirm: false
                //                 })
                //             });
                //         });

                // } else if (status_pendaftaran == "false" && status_pengumuman == "true") {
                //     firebase.database().ref('pengaturan/bukaPendaftaran').update({
                //         aktif: false,
                //     })
                //         .then(function (response) {
                //             firebase.database().ref('pengaturan/bukaPengumuman').update({
                //                 aktif: true,
                //             }).then(function (response) {
                //                 Swal.fire({
                //                     icon: 'success',
                //                     title: 'Perhatian',
                //                     text: 'UPDATE BERHASIL',
                //                     focusConfirm: false
                //                 })
                //             });
                //         });
                // } else {
                //     firebase.database().ref('pengaturan/bukaPendaftaran').update({
                //         aktif: false,
                //     })
                //         .then(function (response) {
                //             firebase.database().ref('pengaturan/bukaPengumuman').update({
                //                 aktif: false,
                //             }).then(function (response) {
                //                 Swal.fire({
                //                     icon: 'success',
                //                     title: 'Perhatian',
                //                     text: 'UPDATE BERHASIL',
                //                     focusConfirm: false
                //                 })
                //             });
                //         });
                // }

                // Notifikasi
                var ref = firebase.database().ref("notifikasi");
                var listRef = $firebaseArray(ref);

                listRef.$loaded().then(function (response) {
                    console.log(response);
                    $scope.notifikasi = response;
                })

                $scope.simpan_perubahanadmin = function () {
                    // $("#wrapper").toggleClass("toggled");
                    var edit_nama = document.getElementById("edit_nama_lengkap").value;
                    console.log(edit_nama);
                    var edit_password = document.getElementById("edit_password").value;
                    firebase.database().ref('admin_super/' + useraktif.uid).update({
                        nama: edit_nama,
                        passwordDisplay: edit_password,
                    });
                    // window.alert('DATA BERHASIL DI UPDATE');
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil di Update',
                    })
                }


                $scope.simpanTambahNotif = function () {
                    var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');

                    var jenisNotif = document.getElementById("jenisNotif").value;
                    var penerimaNotif = document.getElementById("penerimaNotif").value;
                    var pesanNotif = document.getElementById("pesanNotif").value;
                    // var createAt = document.getElementById("nikSiswa").value;

                    // console.log(namaSiswa.length)

                    if (jenisNotif.length != 0 && penerimaNotif.length != 0 && pesanNotif.length != 0) {
                        $ionicLoading.show();
                        var ref = firebase.database().ref("notifikasi/" + jenisNotif + penerimaNotif + createAt);
                        ref.set({
                            jenis: jenisNotif,
                            penerima: penerimaNotif,
                            pesan: pesanNotif,
                            createAt: createAt,
                            create_by: $scope.formData.nama

                        }).then(function (resp) {
                            $ionicLoading.hide();
                            // window.alert('Upload Sukses');
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Update',
                            })
                            // $state.go("menuAdmin.dataSekolahAdmin")
                        })

                    }
                    else {
                        $ionicLoading.hide();
                        // window.alert('Data Belum Lengkap');
                        Swal.fire({
                            icon: 'warning',
                            title: 'Perhatian',
                            text: 'Data Tidak Boleh Kosong',
                        })

                    }
                }
                var updateID = '';
                $('body').on('click', '.updateData', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref('notifikasi/' + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("jenisNotifEdit").value = values.jenis;
                        document.getElementById("penerimaNotifEdit").value = values.penerima;
                        document.getElementById("pesanNotifEdit").value = values.pesan;
                        document.getElementById("createAtEdit").value = values.createAt;
                    });
                });

                $('.updateNotif').on('click', function () {
                    var updtJenis = document.getElementById("jenisNotifEdit").value;
                    var updtPenerima = document.getElementById("penerimaNotifEdit").value;
                    var updtPesan = document.getElementById("pesanNotifEdit").value;
                    var updtCreateAt = document.getElementById("createAtEdit").value;
                    // var updtCreate = document.getElementById("sekolah_asalEdit").value ;
                    // var updtnpsn = document.getElementById("npsnEdit").value;

                    var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
                    if (updtJenis.length > 0 && updtPenerima.length > 0 && updtPesan.length > 0) {

                        var postData = {};
                        postData = {
                            jenis: updtJenis,
                            penerima: updtPenerima,
                            pesan: updtPesan,
                            createAt: updtCreateAt,
                        };

                        var updates = {};
                        updates['/notifikasi/' + updateID] = postData;

                        firebase.database().ref().update(updates);
                        // window.alert("Data Siswa Berhasil Diperbaharui");
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Data Berhasil di Update',
                        })

                    }
                    else {
                        // window.alert("Data Belum Lengkap");
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Data Belum Lengkap',
                        })
                    }
                });
                //HAPUS
                var id = '';
                $("body").on('click', '.removeData', function () {
                    id = $(this).attr('data-id');
                    const swalHapus = Swal.mixin({
                        customClass: {
                            confirmButton: 'btn btn-danger ms-2',
                            cancelButton: 'btn btn-outline-secondary'
                        },
                        buttonsStyling: false
                    })
                    swalHapus.fire({
                        title: 'Perhatian',
                        icon: 'error',
                        html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Notifikasi </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                        showCancelButton: true,
                        confirmButtonText: 'Hapus',
                        reverseButtons: true
                    }).then((result) => {
                        if (result.isConfirmed) {
                            firebase.database().ref('notifikasi/' + id).remove();
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil Dihapus',
                            })
                        }
                    })
                });



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

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

        $scope.edit_admin = function () {
            $state.go('editAdminSuper');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');
        }
        $scope.lookPassword = function () {
            var x = document.getElementById("edit_password");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
            $scope.icon = '-slash'

        }
    }])

    .controller('EditAdminSuperCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $('#btn-data-ranking').on('click', function () {
            if ($('#btn-data-ranking').hasClass('selected')) {
                $('#btn-data-ranking').removeClass('selected');
            } else {
                $('#btn-data-ranking').addClass('selected');
            }
        });
        var userID = $stateParams.idUser;

        $scope.toogle = function () {
            // toogle.preventDefault();
            $("#wrapper").toggleClass("toggled");
        }
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

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');
        }
        $scope.lookPassword = function () {
            var x = document.getElementById("edit_password");
            if (x.type === "password") {
                x.type = "text";
            } else {
                x.type = "password";
            }
            $scope.icon = '-slash'

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
                                    "nama": dataSnapShot.val().nama,
                                    "email": dataSnapShot.val().email,
                                    "password": dataSnapShot.val().passwordDisplay,
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



            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });


    }])