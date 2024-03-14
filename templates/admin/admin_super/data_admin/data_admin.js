angular.module('app.dataAdmin', [])

    .controller('dataAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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

        var arrayjumlah = new Array();
        // LOAD JUMLAH ADMIN DINAS
        var ref = firebase.database().ref("admin_super");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response.length);
            $scope.jumlahAdminSuper = response.length;
            arrayjumlah.push($scope.jumlahAdminSuper)
        })


        // LOAD JUMLAH ADMIN SMP
        var ref = firebase.database().ref("admin_sekolah");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response.length);
            $scope.jumlahAdminSMP = response.length;
            arrayjumlah.push($scope.jumlahAdminSMP)
        })


        // LOAD JUMLAH ADMIN SD
        var ref = firebase.database().ref("admin_sd");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response.length);
            $scope.jumlahAdminSD = response.length;
            arrayjumlah.push($scope.jumlahAdminSD)
            console.log(arrayjumlah);

            $scope.jumlahTotalAdmin = arrayjumlah.reduce((acc, curr) => acc + curr);
            console.log($scope.jumlahTotalAdmin);
            firebase.database().ref('jumlah').update({
                jumlah_admin: $scope.jumlahTotalAdmin,
            }).then(function () {
                console.log("Update Jumlah total Admin");
            })
        })










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

        $scope.adminSuperDinas = function () {
            $state.go('dataAdminSuperDinas');
        }

        $scope.adminSmp = function () {
            $state.go('dataAdminSmp');
        }

        $scope.adminSd = function () {
            $state.go('dataAdminSd');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuper');
        }




    }])


    .controller('dataAdminSuperDinasCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
                                    "password": dataSnapShot.val().password,
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

                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-adminDinas'));
                    XLSX.writeFile(wb, "Data Admin Dinas" + ".xlsx");
                }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }

            var ref = firebase.database().ref("admin_super");
            var listRef = $firebaseArray(ref);

            $ionicLoading.show();
            listRef.$loaded().then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $scope.adminSuperDinas = response;
            })


            //UPDATE
            var updateID = '';
            $('body').on('click', '.updateDataAdminSuper', function () {
                updateID = $(this).attr('data-id');
                // window.alert(updateID);
                firebase.database().ref('admin_super/' + updateID).on('value', function (snapshot) {
                    var values = snapshot.val();
                    document.getElementById("namaAdmin").value = values.nama;
                    document.getElementById("emailAdmin").value = values.email;
                    document.getElementById("passwordAdmin").value = values.password;
                });
                $scope.simpan = function () {
                    var namaAdminEdit = document.getElementById("namaAdmin").value;
                    if (namaAdminEdit !== "") {

                        firebase.database().ref('admin_super/' + updateID).update({
                            nama: namaAdminEdit
                        }).then(function () {
                            // location.reload();
                            // window.alert('Data Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Update',
                            })
                        });
                    }
                    else {
                        // window.alert('Data Tidak Boleh Kosong')
                        Swal.fire({
                            icon: 'warning',
                            title: 'Perhatian',
                            text: 'Data Tidak Boleh Kosong',
                        })
                    }
                }
            });
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
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
    }])


    .controller('dataAdminSmpCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
                                    "password": dataSnapShot.val().password,
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
                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-adminSMP'));
                    XLSX.writeFile(wb, "Data Admin SMP" + ".xlsx");
                }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }

            var ref = firebase.database().ref("admin_sekolah");
            var listRef = $firebaseArray(ref);

            $ionicLoading.show();
            listRef.$loaded().then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $scope.adminSMP = response;
            })


            //UPDATE
            var updateID = '';
            $('body').on('click', '.updateDataAdminSmp', function () {
                updateID = $(this).attr('data-id');
                // window.alert(updateID);
                firebase.database().ref('admin_sekolah/' + updateID).on('value', function (snapshot) {
                    var values = snapshot.val();
                    document.getElementById("namaAdmin").value = values.nama;
                    document.getElementById("emailAdmin").value = values.email;
                    document.getElementById("passwordAdmin").value = values.passwordDisplay;
                    document.getElementById("noHPAdmin").value = values.noHp;
                });
                $scope.simpan = function () {
                    var namaAdminEdit = document.getElementById("namaAdmin").value;
                    if (namaAdminEdit !== "") {

                        firebase.database().ref('admin_sekolah/' + updateID).update({
                            nama: namaAdminEdit
                        }).then(function () {
                            // location.reload();
                            // window.alert('Data Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Update',
                            })
                        });
                    }
                    else {
                        // window.alert('Data Tidak Boleh Kosong')
                        Swal.fire({
                            icon: 'warning',
                            title: 'Perhatian',
                            text: 'Data Tidak Boleh Kosong',
                        })
                    }
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
                    html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Admin </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                    showCancelButton: true,
                    confirmButtonText: 'Hapus',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        firebase.database().ref('admin_sekolah/' + id).remove();
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Data Berhasil Dihapus',
                        })
                    }
                })
            });

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
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuper');
        }
    }])



    .controller('dataAdminSdCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
                                    "password": dataSnapShot.val().password,
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
                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-adminSD'));
                    XLSX.writeFile(wb, "Data Admin SD" + ".xlsx");
                }
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }

            var ref = firebase.database().ref("admin_sd");
            var listRef = $firebaseArray(ref);

            $ionicLoading.show();
            listRef.$loaded().then(function (response) {
                $ionicLoading.hide();
                console.log(response);
                $scope.adminSD = response;
            })


            //UPDATE
            var updateID = '';
            $('body').on('click', '.updateDataAdminSd', function () {
                updateID = $(this).attr('data-id');
                // window.alert(updateID);
                firebase.database().ref('admin_sd/' + updateID).on('value', function (snapshot) {
                    var values = snapshot.val();
                    document.getElementById("namaAdmin").value = values.nama;
                    document.getElementById("emailAdmin").value = values.email;
                    document.getElementById("passwordAdmin").value = values.passwordDisplay;
                    document.getElementById("aksesAdmin").value = values.status_aksi;
                });


                $scope.simpanEditAdminSD = function () {
                    var aksesAdminEdit = document.getElementById("aksesAdmin").value;
                    if (aksesAdminEdit !== "") {
                        if (aksesAdminEdit == 'true') {
                            aksesAdminEdit = true;
                            firebase.database().ref('admin_sd/' + updateID).update({
                                status_aksi: aksesAdminEdit
                            }).then(function () {
                                // location.reload();
                                // window.alert('Data Berhasil di Update')
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Sukses',
                                    text: 'Data Berhasil di Update',
                                })
                            });
                        } else {
                            aksesAdminEdit = false;
                            firebase.database().ref('admin_sd/' + updateID).update({
                                status_aksi: aksesAdminEdit
                            }).then(function () {
                                // location.reload();
                                // window.alert('Data Berhasil di Update')
                                Swal.fire({
                                    icon: 'success',
                                    title: 'Sukses',
                                    text: 'Data Berhasil di Update',
                                })
                            });
                        }
                    }
                    else {
                        // window.alert('Data Tidak Boleh Kosong')
                        Swal.fire({
                            icon: 'warning',
                            title: 'Perhatian',
                            text: 'Data Tidak Boleh Kosong',
                        })
                    }
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
                    html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Admin </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                    showCancelButton: true,
                    confirmButtonText: 'Hapus',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        firebase.database().ref('admin_sd/' + id).remove();
                        Swal.fire({
                            icon: 'success',
                            title: 'Sukses',
                            text: 'Data Berhasil Dihapus',
                        })
                    }
                })
                // window.alert("Data Berhasil Dihapus");
            });

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
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuper');
        }
    }])