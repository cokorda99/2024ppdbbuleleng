angular.module('app.calonsiswaSd', [])

    .controller('calonsiswaSdCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;
        var idSd = '';
        var namaSD = '';
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
                var pengguna = dbRef.ref('admin_sd');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sd').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "npsn": dataSnapShot.val().npsn,
                                    "nama": dataSnapShot.val().nama,
                                    "sekolah": dataSnapShot.val().sekolah,
                                };
                                $scope.form = {
                                    "nisn": "",
                                    "nik": "",
                                    "tglLahir": "",
                                    "tempatLahir": "",
                                    "nama": "",
                                    "alamat": "",
                                    // "id_sd": idSd,
                                    // "sekolah_asal": namaSd,
                                    "id_smp": "",
                                    "nama_smp": "",
                                }
                                console.log($scope.formData.npsn);
                                var ref = firebase.database().ref("datasiswa_daftarSD").orderByChild('idSekolahPilihanSiswa').equalTo(String($scope.formData.npsn));
                                var listRef = $firebaseArray(ref);

                                $ionicLoading.show();
                                listRef.$loaded().then(function (response) {
                                    $ionicLoading.hide();
                                    console.log(response);
                                    $scope.siswa = response;
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

        $scope.beranda = function () {
            $state.go('berandaAdminSd');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswaSd');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSd');
        }

        $scope.siswa_terdaftar = function () {
            $state.go('dataSiswaterdaftarSd');
        }
        $scope.siswa_diterima = function () {
            $state.go('dataSiswaDiterimaSd');
        }

        $scope.formEdit = {
            "jenjang": '',
            "status": '',
            "namaSekolah": '',
            "idProvinsi": '',
            "idKotaKabupaten": '',
            "idKecamatan": '',
            "alamatSekolah": '',
            "npsn": '',
        }

        //Edit
        var updateID = '';
        $('body').on('click', '.detailData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('datasiswa_daftarSD/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("nisnEdit").value = values.nisnSiswa;
                document.getElementById("nikEdit").value = values.nikSiswa;
                document.getElementById("namaEdit").value = values.namaSiswa;
                document.getElementById("tglLahirEdit").value = values.tanggal_lahirSiswa;
                document.getElementById("tempatLahirEdit").value = values.tempatLahirSiswa;
                document.getElementById("KecamatanEdit").value = values.namaKecamatanSiswa;
                document.getElementById("DesaEdit").value = values.namaDesaSiswa;

                $scope.jalurSiswa = values.jalurSiswa;


                firebase.database().ref('datasiswa_daftarSD/' + updateID + '/fileKK').on('value', function (snapshot) {
                    var data = snapshot.val();
                    var url = data.URL
                    // console.log(url);

                    $scope.lihatFileKK = function () {
                        window.open(url);
                    }

                })

                if (values.jalurSiswa != 'Zonasi') {
                    firebase.database().ref('datasiswa_daftarSD/' + updateID + '/filelain').on('value', function (snapshot) {
                        var data = snapshot.val();
                        var url = data.URL
                        // console.log(url);

                        $scope.lihatFilelain = function () {
                            window.open(url);
                        }

                    })
                } else {
                    console.log('Zonasi')
                }

            });

            // VERIFIKASI
            $scope.Verifikasi = function () {
                firebase.database().ref('datasiswa_daftarSD/' + updateID).update({
                    statusVerif: true,
                }).then(function () {
                    $("#modal_edit").modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Verifikasi Berhasil',
                    })
                })
            }

            // BATAL VERIFIKASI
            $scope.BatalVerifikasi = function () {
                firebase.database().ref('datasiswa_daftarSD/' + updateID).update({
                    statusVerif: false,
                }).then(function () {
                    $("#modal_edit").modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Update Data Berhasil',
                    })
                })
            }
        });



        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-siswa-sd'));
            XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
        }

        // $scope.addSiswa = function () {
        //     var namaSiswa = document.getElementById("namaSiswa").value;
        //     var nisnSiswa = document.getElementById("nisnSiswa").value;
        //     var nikSiswa = document.getElementById("nikSiswa").value;
        //     var tglLahirSiswa = document.getElementById("tglLahirSiswa").value;
        //     var tempatLahirSiswa = document.getElementById("tempatLahirSiswa").value;

        //     var idKecamatanSiswa = document.getElementById("idKecamatanSiswa").value;
        //     var idDesaSiswa = document.getElementById("idDesaSiswa").value;
        //     var AlamatSiswa = document.getElementById("AlamatSiswa").value;
        //     var AlamatKordinatSiswa = document.getElementById("AlamatKordinatSiswa").value;
        //     var sekolahSiswa = document.getElementById("sekolahSiswa").value;

        //     var npsnSiswa = document.getElementById("npsnSiswa").value;
        //     var namaIbu = document.getElementById("namaIbu").value;
        //     var pekerjaanIbu = document.getElementById("pekerjaanIbu").value;
        //     var penghasilanIbu = document.getElementById("penghasilanIbu").value;
        //     var namaAyah = document.getElementById("namaAyah").value;

        //     var pekerjaanAyah = document.getElementById("pekerjaanAyah").value;
        //     var penghasilanAyah = document.getElementById("penghasilanAyah").value;
        //     var namaWali = document.getElementById("namaWali").value;
        //     var pekerjaanWali = document.getElementById("pekerjaanWali").value;
        //     var penghasilanWali = document.getElementById("penghasilanWali").value;

        //     console.log(namaSiswa, nisnSiswa, nikSiswa, tglLahirSiswa, tempatLahirSiswa);
        //     console.log(idKecamatanSiswa, idDesaSiswa, AlamatSiswa, AlamatKordinatSiswa, sekolahSiswa);
        //     console.log(npsnSiswa, namaIbu, pekerjaanIbu, penghasilanIbu, namaAyah);
        //     console.log(pekerjaanAyah, penghasilanAyah, namaWali, pekerjaanWali, penghasilanWali);

        // }

        $scope.clearInput = function () {
            $('form').find('input[type=text], input[type=password], input[type=number], input[type=file],input[type=email], textarea , select').val('');
            $scope.form.idKecamatan = undefined;
            $scope.form.idDesa = undefined;
            $scope.form.idBanjar = undefined;
        };

        $scope.simpanEditSiswa = function () {
            var updtKecamatan = $scope.form.idKecamatan;
            var updtDesa = $scope.form.idDesa;
            var updtBanjar = $scope.form.idBanjar;
            var updtKordinat = document.getElementById("kordinatEdit").value;
            console.log(updtKecamatan, updtDesa, updtBanjar, updtKordinat);

            if (updtKecamatan != undefined && updtDesa != undefined && updtBanjar != undefined) {
                $ionicLoading.show()
                firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            $ionicLoading.hide()
                            firebase.database().ref('siswa/' + data.key).update({
                                alamatzonasi: updtKordinat,
                                idDesa: updtDesa,
                                idKecamatan: updtKecamatan,
                                namaKecamatan: $scope.namaKecamatan,
                                sekolahZonasi: $scope.sklhNama1,
                                idsekolah_zonasi: $scope.sklhId1,
                                sekolahZonasiAlamat: $scope.sklhAlamat1
                            }).then(function () {
                                console.log('EDIT /SISWA');
                                firebase.database().ref('datasiswa/' + updateID).update({
                                    kordinatzonasi: updtKordinat,
                                    idBanjar: updtBanjar,
                                    idDesa: updtDesa,
                                    idKecamatan: updtKecamatan,
                                    namaKecamatan: $scope.namaKecamatan,
                                    namaDesa: $scope.namaDesa,
                                    namaBanjar: $scope.namaBanjar,
                                    sekolah_zonasi: $scope.sklhNama1,
                                    idsekolah_zonasi: $scope.sklhId1,
                                    alamatsekolahzonasi: $scope.sklhAlamat1,
                                    chekKordinat: 0
                                }).then(function () {
                                    $("#modal_edit").modal('hide');
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Success',
                                        text: 'Data Berhasil di update',
                                    })
                                    $scope.clearInput();
                                    $scope.form.idKecamatan = undefined;
                                    $scope.form.idDesa = undefined;
                                    $scope.form.idBanjar = undefined;
                                })
                            })
                        })

                    } else {
                        $ionicLoading.hide()
                        firebase.database().ref('datasiswa/' + updateID).update({
                            kordinatzonasi: updtKordinat,
                            idBanjar: updtBanjar,
                            idDesa: updtDesa,
                            idKecamatan: updtKecamatan,
                            namaKecamatan: $scope.namaKecamatan,
                            namaDesa: $scope.namaDesa,
                            namaBanjar: $scope.namaBanjar,
                            sekolah_zonasi: $scope.sklhNama1,
                            idsekolah_zonasi: $scope.sklhId1,
                            alamatsekolahzonasi: $scope.sklhAlamat1,
                            chekKordinat: 0
                        }).then(function () {
                            $("#modal_edit").modal('hide');
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Data Berhasil di update',
                            })

                            $scope.clearInput();
                            $scope.form.idKecamatan = undefined;
                            $scope.form.idDesa = undefined;
                            $scope.form.idBanjar = undefined;
                        });
                        // location.reload();
                    }
                })
            } else {
                $("#modal_edit").modal('hide');
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Data Tidak boleh Kosong',
                })
            }
        }



        // HAPUS


        var id = '';
        $("body").on('click', '.removeData', function () {
            id = $(this).attr('data-id');
        });

        $('.deleteRecord').on('click', function () {
            firebase.database().ref('datasiswa_daftarSD/' + id).remove();
            // window.alert("Data Berhasil Dihapus");
            $("#modal_hapus").modal('hide');
            $('.modal-backdrop').remove();
            $("#alert-delete-danger").show(function () {
                $("#alert-delete-danger").fadeTo(2000, 500).slideUp(500, function () {
                    $("#alert-delete-danger").slideUp(500);
                });
            });
        });


    }])


    .controller('rank_calonsiswaSdCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var userID = $stateParams.idUser;
        var idSd = '';
        var namaSD = '';
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
                var pengguna = dbRef.ref('admin_sd');
                pengguna.orderByChild('id').equalTo(useraktif.uid).on("value", function (snapshot) {
                    console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            let firebaseRefKey = firebase.database().ref('admin_sd').child(data.key);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "npsn": dataSnapShot.val().npsn,
                                    "nama": dataSnapShot.val().nama,
                                    "sekolah": dataSnapShot.val().sekolah,
                                };
                                $scope.form = {
                                    "nisn": "",
                                    "nik": "",
                                    "tglLahir": "",
                                    "tempatLahir": "",
                                    "nama": "",
                                    "alamat": "",
                                    // "id_sd": idSd,
                                    // "sekolah_asal": namaSd,
                                    "id_smp": "",
                                    "nama_smp": "",
                                }
                                console.log($scope.formData.npsn);
                                // var ref = firebase.database().ref("datasiswa_rankSD").orderByChild('idSekolahPilihanSiswa').equalTo(String($scope.formData.npsn));
                                var ref = firebase.database().ref("datasiswa_rankSD");
                                var listRef = $firebaseArray(ref);

                                $ionicLoading.show();
                                listRef.$loaded().then(function (response) {
                                    $ionicLoading.hide();
                                    console.log(response);
                                    $scope.siswa = response;
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

        $scope.beranda = function () {
            $state.go('berandaAdminSd');
        }

        $scope.data_siswa = function () {
            $state.go('dataSiswaSd');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSd');
        }

        $scope.siswa_terdaftar = function () {
            $state.go('dataSiswaterdaftarSd');
        }
        $scope.siswa_diterima = function () {
            $state.go('dataSiswaDiterimaSd');
        }

        $scope.formEdit = {
            "jenjang": '',
            "status": '',
            "namaSekolah": '',
            "idProvinsi": '',
            "idKotaKabupaten": '',
            "idKecamatan": '',
            "alamatSekolah": '',
            "npsn": '',
        }

        //Edit
        var updateID = '';
        $('body').on('click', '.detailData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('datasiswa_daftarSD/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("nisnEdit").value = values.nisnSiswa;
                document.getElementById("nikEdit").value = values.nikSiswa;
                document.getElementById("namaEdit").value = values.namaSiswa;
                document.getElementById("tglLahirEdit").value = values.tanggal_lahirSiswa;
                document.getElementById("tempatLahirEdit").value = values.tempatLahirSiswa;
                document.getElementById("KecamatanEdit").value = values.namaKecamatanSiswa;
                document.getElementById("DesaEdit").value = values.namaDesaSiswa;

                $scope.jalurSiswa = values.jalurSiswa;


                firebase.database().ref('datasiswa_daftarSD/' + updateID + '/fileKK').on('value', function (snapshot) {
                    var data = snapshot.val();
                    var url = data.URL
                    // console.log(url);

                    $scope.lihatFileKK = function () {
                        window.open(url);
                    }

                })

                if (values.jalurSiswa != 'Zonasi') {
                    firebase.database().ref('datasiswa_daftarSD/' + updateID + '/filelain').on('value', function (snapshot) {
                        var data = snapshot.val();
                        var url = data.URL
                        // console.log(url);

                        $scope.lihatFilelain = function () {
                            window.open(url);
                        }

                    })
                } else {
                    console.log('Zonasi')
                }

            });

            // VERIFIKASI
            $scope.Verifikasi = function () {
                firebase.database().ref('datasiswa_daftarSD/' + updateID).update({
                    statusVerif: true,
                }).then(function () {
                    $("#modal_edit").modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Verifikasi Berhasil',
                    })
                })
            }

            // BATAL VERIFIKASI
            $scope.BatalVerifikasi = function () {
                firebase.database().ref('datasiswa_daftarSD/' + updateID).update({
                    statusVerif: false,
                }).then(function () {
                    $("#modal_edit").modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Update Data Berhasil',
                    })
                })
            }
        });



        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-siswa-sd'));
            XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
        }

        $scope.getRank= function () {
            
        }

        $scope.clearInput = function () {
            $('form').find('input[type=text], input[type=password], input[type=number], input[type=file],input[type=email], textarea , select').val('');
            $scope.form.idKecamatan = undefined;
            $scope.form.idDesa = undefined;
            $scope.form.idBanjar = undefined;
        };

        $scope.simpanEditSiswa = function () {
            var updtKecamatan = $scope.form.idKecamatan;
            var updtDesa = $scope.form.idDesa;
            var updtBanjar = $scope.form.idBanjar;
            var updtKordinat = document.getElementById("kordinatEdit").value;
            console.log(updtKecamatan, updtDesa, updtBanjar, updtKordinat);

            if (updtKecamatan != undefined && updtDesa != undefined && updtBanjar != undefined) {
                $ionicLoading.show()
                firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            console.log(data.key);
                            $ionicLoading.hide()
                            firebase.database().ref('siswa/' + data.key).update({
                                alamatzonasi: updtKordinat,
                                idDesa: updtDesa,
                                idKecamatan: updtKecamatan,
                                namaKecamatan: $scope.namaKecamatan,
                                sekolahZonasi: $scope.sklhNama1,
                                idsekolah_zonasi: $scope.sklhId1,
                                sekolahZonasiAlamat: $scope.sklhAlamat1
                            }).then(function () {
                                console.log('EDIT /SISWA');
                                firebase.database().ref('datasiswa/' + updateID).update({
                                    kordinatzonasi: updtKordinat,
                                    idBanjar: updtBanjar,
                                    idDesa: updtDesa,
                                    idKecamatan: updtKecamatan,
                                    namaKecamatan: $scope.namaKecamatan,
                                    namaDesa: $scope.namaDesa,
                                    namaBanjar: $scope.namaBanjar,
                                    sekolah_zonasi: $scope.sklhNama1,
                                    idsekolah_zonasi: $scope.sklhId1,
                                    alamatsekolahzonasi: $scope.sklhAlamat1,
                                    chekKordinat: 0
                                }).then(function () {
                                    $("#modal_edit").modal('hide');
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Success',
                                        text: 'Data Berhasil di update',
                                    })
                                    $scope.clearInput();
                                    $scope.form.idKecamatan = undefined;
                                    $scope.form.idDesa = undefined;
                                    $scope.form.idBanjar = undefined;
                                })
                            })
                        })

                    } else {
                        $ionicLoading.hide()
                        firebase.database().ref('datasiswa/' + updateID).update({
                            kordinatzonasi: updtKordinat,
                            idBanjar: updtBanjar,
                            idDesa: updtDesa,
                            idKecamatan: updtKecamatan,
                            namaKecamatan: $scope.namaKecamatan,
                            namaDesa: $scope.namaDesa,
                            namaBanjar: $scope.namaBanjar,
                            sekolah_zonasi: $scope.sklhNama1,
                            idsekolah_zonasi: $scope.sklhId1,
                            alamatsekolahzonasi: $scope.sklhAlamat1,
                            chekKordinat: 0
                        }).then(function () {
                            $("#modal_edit").modal('hide');
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Data Berhasil di update',
                            })

                            $scope.clearInput();
                            $scope.form.idKecamatan = undefined;
                            $scope.form.idDesa = undefined;
                            $scope.form.idBanjar = undefined;
                        });
                        // location.reload();
                    }
                })
            } else {
                $("#modal_edit").modal('hide');
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Data Tidak boleh Kosong',
                })
            }
        }



        // HAPUS


        var id = '';
        $("body").on('click', '.removeData', function () {
            id = $(this).attr('data-id');
        });

        $('.deleteRecord').on('click', function () {
            firebase.database().ref('datasiswa_daftarSD/' + id).remove();
            // window.alert("Data Berhasil Dihapus");
            $("#modal_hapus").modal('hide');
            $('.modal-backdrop').remove();
            $("#alert-delete-danger").show(function () {
                $("#alert-delete-danger").fadeTo(2000, 500).slideUp(500, function () {
                    $("#alert-delete-danger").slideUp(500);
                });
            });
        });


    }])
