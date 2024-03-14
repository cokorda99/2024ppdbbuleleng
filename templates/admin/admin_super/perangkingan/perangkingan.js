angular.module('app.dataPerangkinganAdminSuper', [])
    .controller('dataPendaftarPerangkinganZonasiCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


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

        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
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

                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-seluruh-smp'));
                    XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
                }

                $scope.jalan = function () {
                    console.log('JALAN')
                    var ref = firebase.database().ref("siswa");
                    var listRef = $firebaseArray(ref);
                    listRef.$loaded().then(function (response) {
                        console.log(response);
                        for (let index = 0; index < response.length; index++) {
                            // console.log(response[index]);
                            // console.log(response[index].status_skl);
                            if (response[index].status_daftarZonasi == true) {
                                console.log('SKIP DAH DAFTAR');
                            } else {
                                firebase.database().ref('siswa/' + response[index].uid).update({
                                    status_skl: false,

                                }).then(function () {
                                    console.log("Update " + index, response[index].nisn);
                                })
                            }
                        }
                    })
                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftarAfirmasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifAfirmasi").value = values.nisn;
                        document.getElementById("nikVerifAfirmasi").value = values.nik;
                        document.getElementById("namaVerifAfirmasi").value = values.nama;
                        document.getElementById("alamatsiswaVerifAfirmasi").value = values.alamat;
                        document.getElementById("alamatVerifAfirmasi").value = values.alamatzonasi;
                        document.getElementById("sekolahVerifAfirmasi").value = values.sekolah_asal;
                        document.getElementById("tglLahirVerifAfirmasi").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifAfirmasi").value = values.jarak;
                        document.getElementById("noSKLVerifAfirmasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifAfirmasi").value = values.nilai_skl;
                        document.getElementById("noKKVerifAfirmasi").value = values.noKK;
                        document.getElementById("statusKKVerifAfirmasi").value = values.statusKK;
                        console.log(values.uid);


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

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });

                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarPrestasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifPrestasi").value = values.nisn;
                        document.getElementById("nikVerifPrestasi").value = values.nik;
                        document.getElementById("namaVerifPrestasi").value = values.nama;
                        // document.getElementById("alamatVerif").value = values.alamatzonasi + " , " + values.namaDesa;
                        document.getElementById("tglLahirVerifPrestasi").value = values.tanggal_lahir;
                        document.getElementById("poinPrestasi").value = values.poinPrestasi;
                        document.getElementById("noSKLVerifPrestasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifPrestasi").value = values.nilai_skl;
                        document.getElementById("sekolahAsalSDPrestasi").value = values.sekolah_asal;

                        // document.getElementById("berkasPress").value = values.berkasprestasi;
                        $scope.jenisPress = values.jenisPrestasi;
                        if ($scope.jenisPress !== 'keterampilan') {
                            $('#berkasBuktiPrestasi').show();
                            $('#berkasBuktiKeterampilan').hide();

                        } else {
                            $('#berkasBuktiPrestasi').hide();
                            $('#berkasBuktiKeterampilan').show();
                        }
                        document.getElementById("jenisPress").value = values.jenisPrestasi;

                        document.getElementById("tingkatPress").value = values.tingkatprestasi;
                        document.getElementById("namaKompDes").value = values.namaKompetisi;
                        document.getElementById("cabangKompeti").value = values.cabangKompetisi;
                        document.getElementById("peringkatPress").value = values.juaraPrestasi;
                        document.getElementById("akumulasiNilaiRap").value = values.akumulasiRaportPrestasi;


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

                            var poinPrestasiinput = document.getElementById("poinPrestasi").value
                            console.log(poinPrestasiinput);

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                status_uprove: true,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            var poinPrestasiinput = document.getElementById("poinPrestasi").value
                            console.log(poinPrestasiinput);

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                status_uprove: false,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarPerpindahan', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifPerpindahan").value = values.nisn;
                        document.getElementById("nikVerifPerpindahan").value = values.nik;
                        document.getElementById("namaVerifPerpindahan").value = values.nama;
                        document.getElementById("alamatVerifPerpindahan").value = values.alamatzonasi;
                        document.getElementById("tglLahirVerifPerpindahan").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifPerpindahan").value = values.jarak;
                        document.getElementById("noSKLVerifPerpindahan").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifPerpindahan").value = values.nilai_skl;

                        document.getElementById("sekolahAsalSDPerpindahan").value = values.sekolah_asal;


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

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarZonasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifZonasi").value = values.nisn;
                        document.getElementById("nikVerifZonasi").value = values.nik;
                        document.getElementById("namaVerifZonasi").value = values.nama;
                        document.getElementById("alamatsiswaVerifZonasi").value = values.alamat;
                        document.getElementById("alamatVerifZonasi").value = values.alamatzonasi;
                        document.getElementById("sekolahVerifZonasi").value = values.sekolah_asal;
                        document.getElementById("tglLahirVerifZonasi").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifZonasi").value = values.jarak;
                        document.getElementById("noSKLVerifZonasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifZonasi").value = values.nilai_skl;
                        document.getElementById("noKKVerifZonasi").value = values.noKK;
                        document.getElementById("statusKKVerifZonasi").value = values.statusKK;
                        document.getElementById("desaVerifikasiZonasi").value = values.namaDesa;
                        document.getElementById("luarzona").value = values.luarzonasi;


                        if (values.koreksi == undefined) {
                            document.getElementById("koreksiTampil").value = 'Tidak Ada Pesan Koreksi';
                        } else {
                            document.getElementById("koreksiTampil").value = values.koreksi;
                        }
                        console.log(values.uid);

                        var idSD = values.id_sd;
                        var idSMP = values.sekolahZonasiId;


                        $scope.status_daftar = values.status_daftar;
                        console.log($scope.status_daftar);
                        if ($scope.status_daftar == true) {
                            document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        } else {
                            document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        }


                        // firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                        //     var data = snapshot.val();
                        //     var url = data.URL
                        //     console.log(url);
                        //     if (url == null) {
                        //         console("file")
                        //     }

                        //     $scope.lihatFileSKL = function () {
                        //         window.open(url);
                        //     }

                        // })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.simpanAkses = function () {
                            var chekdaftar = document.getElementById("bukadaftar").value;

                            console.log(chekdaftar);

                            if (chekdaftar == 'on') {
                                firebase.database().ref('siswa/' + updateID).update({
                                    status_daftar: false,
                                    status_daftarJalur: false,
                                    status_daftarZonasi: false,
                                    status_skl: false,
                                    status_terima: false,
                                    status_uprove: false,
                                    status_skl: false,
                                });

                                firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                // firebase.database().ref('siswa/'+ updateID + '/file').remove();

                            } else {
                                console.log('TIDAK UPDATE');
                            }
                            // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Siswa Berhasil di Update',
                            })
                            $("#modal_edit-zonasi").modal('hide')
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });

                $('body').on('click', '.updateDataDaftarNull', function () {
                    // updateID = $(this).attr('data-id');
                    updateID = $(this).attr('data-id');
                    window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifZonasiNULL").value = values.nisn;
                        document.getElementById("nikVerifZonasiNULL").value = values.nik;
                        document.getElementById("namaVerifZonasiNULL").value = values.nama;

                        var idSD = values.id_sd;
                        var idSMP = values.sekolahZonasiId;


                        $scope.status_daftar = values.status_daftar;
                        console.log($scope.status_daftar);
                        if ($scope.status_daftar == true) {
                            document.getElementById("chekdaftarNULL").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        } else {
                            document.getElementById("chekdaftarNULL").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        }


                        // firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                        //     var data = snapshot.val();
                        //     var url = data.URL
                        //     console.log(url);
                        //     if (url == null) {
                        //         console("file")
                        //     }

                        //     $scope.lihatFileSKL = function () {
                        //         window.open(url);
                        //     }

                        // })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.simpanAkses = function () {
                            var chekdaftar = document.getElementById("bukadaftar").value;

                            console.log(chekdaftar);

                            if (chekdaftar == 'on') {
                                firebase.database().ref('siswa/' + updateID).update({
                                    status_daftar: false,
                                    status_daftarJalur: false,
                                    status_daftarZonasi: false,
                                    status_skl: false,
                                    status_terima: false,
                                    status_uprove: false,
                                    status_skl: false,
                                });

                                firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                // firebase.database().ref('siswa/'+ updateID + '/file').remove();

                            } else {
                                console.log('TIDAK UPDATE');
                            }
                            // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Siswa Berhasil di Update',
                            })
                            $("#modal_edit-zonasiNULL").modal('hide')
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }
        var no = 0;
        var listData = [];
        var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
            var value = snapshot.val();
            var numChild = snapshot.numChildren();
            var jmlhZona = 0;
            // console.log("id smp : " + snapshot.key);

            // console.log('ID'+ value);
            var ref1 = firebase.database().ref('smp/' + snapshot.key + '/zonasi_rank').orderByChild('finalPoin');
            var listRef1 = $firebaseArray(ref1);

            listRef1.$loaded().then(function (response) {
                firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                    $scope.kuotaZona = parseInt(dataSnapShot1.val().kuota_zonasi);
                    console.log(dataSnapShot1.val().sekolah)
                    console.log($scope.kuotaZona)
                    for (i = 0; i < response.length; i++) {
                        jmlhZona = jmlhZona + 1;
                        listData.push(response[i]);
                        if (jmlhZona <= $scope.kuotaZona) {
                            console.log('lolos : ', response[i].nisn);
                            // firebase.database().ref('siswa/' + response[i].uid).update({
                            //     status_terima: true,
                            // });

                            // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                            //     status_terima: true,
                            // });

                            // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                            //     status_terima: true,
                            // });

                        } else {
                            console.log('tidak lolos : ', response[i].nisn);
                            // firebase.database().ref('siswa/' + response[i].uid).update({
                            //     status_terima: false,
                            // });

                            // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                            //     status_terima: false,
                            // });

                            // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                            //     status_terima: false,
                            // });
                        }
                    }
                    console.log('=========================================');
                    console.log('Jumlah pendaftar Zonasi' + jmlhZona)
                    console.log($scope.kuotaZona);
                    $scope.pendaftar_siswa = listData;
                    no = no + 1;
                    console.log("=================================");
                    console.log(no.toString(), ". id smp : " + snapshot.key);
                })
                // console.log(response);
            })
        });
        // var listRef = $firebaseArray(ref);
        // $ionicLoading.show();
        // listRef.$loaded().then(function (response) {
        //     $ionicLoading.hide();
        //     // console.log(response[0].jalur2);
        //     $scope.jumlah_pendaftar_siswa = response.length;
        //     $scope.pendaftar_siswa = response;
        //     // for (let index = 0; index < response.length; index++) {

        //     // }

        // })

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

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])

    .controller('dataPendaftarPerangkinganJalurCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


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

        $scope.data_pendaftarseluruhsmp = function () {
            $state.go('dataPendaftarSeluruhSMP');
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

                $scope.cetak = function () {
                    var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-seluruh-smp'));
                    XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
                }

                $scope.jalan = function () {
                    console.log('JALAN')
                    var ref = firebase.database().ref("siswa");
                    var listRef = $firebaseArray(ref);
                    listRef.$loaded().then(function (response) {
                        console.log(response);
                        for (let index = 0; index < response.length; index++) {
                            // console.log(response[index]);
                            // console.log(response[index].status_skl);
                            if (response[index].status_daftarZonasi == true) {
                                console.log('SKIP DAH DAFTAR');
                            } else {
                                firebase.database().ref('siswa/' + response[index].uid).update({
                                    status_skl: false,

                                }).then(function () {
                                    console.log("Update " + index, response[index].nisn);
                                })
                            }
                        }
                    })
                }

                //UPDATE
                var updateID = '';
                $('body').on('click', '.updateDataDaftarAfirmasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifAfirmasi").value = values.nisn;
                        document.getElementById("nikVerifAfirmasi").value = values.nik;
                        document.getElementById("namaVerifAfirmasi").value = values.nama;
                        document.getElementById("alamatsiswaVerifAfirmasi").value = values.alamat;
                        document.getElementById("alamatVerifAfirmasi").value = values.alamatzonasi;
                        document.getElementById("sekolahVerifAfirmasi").value = values.sekolah_asal;
                        document.getElementById("tglLahirVerifAfirmasi").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifAfirmasi").value = values.jarak;
                        document.getElementById("noSKLVerifAfirmasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifAfirmasi").value = values.nilai_skl;
                        document.getElementById("noKKVerifAfirmasi").value = values.noKK;
                        document.getElementById("statusKKVerifAfirmasi").value = values.statusKK;
                        console.log(values.uid);


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

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });

                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/afirmasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarPrestasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifPrestasi").value = values.nisn;
                        document.getElementById("nikVerifPrestasi").value = values.nik;
                        document.getElementById("namaVerifPrestasi").value = values.nama;
                        // document.getElementById("alamatVerif").value = values.alamatzonasi + " , " + values.namaDesa;
                        document.getElementById("tglLahirVerifPrestasi").value = values.tanggal_lahir;
                        document.getElementById("poinPrestasi").value = values.poinPrestasi;
                        document.getElementById("noSKLVerifPrestasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifPrestasi").value = values.nilai_skl;
                        document.getElementById("sekolahAsalSDPrestasi").value = values.sekolah_asal;

                        // document.getElementById("berkasPress").value = values.berkasprestasi;
                        $scope.jenisPress = values.jenisPrestasi;
                        if ($scope.jenisPress !== 'keterampilan') {
                            $('#berkasBuktiPrestasi').show();
                            $('#berkasBuktiKeterampilan').hide();

                        } else {
                            $('#berkasBuktiPrestasi').hide();
                            $('#berkasBuktiKeterampilan').show();
                        }
                        document.getElementById("jenisPress").value = values.jenisPrestasi;

                        document.getElementById("tingkatPress").value = values.tingkatprestasi;
                        document.getElementById("namaKompDes").value = values.namaKompetisi;
                        document.getElementById("cabangKompeti").value = values.cabangKompetisi;
                        document.getElementById("peringkatPress").value = values.juaraPrestasi;
                        document.getElementById("akumulasiNilaiRap").value = values.akumulasiRaportPrestasi;


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

                            var poinPrestasiinput = document.getElementById("poinPrestasi").value
                            console.log(poinPrestasiinput);

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                status_uprove: true,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            var poinPrestasiinput = document.getElementById("poinPrestasi").value
                            console.log(poinPrestasiinput);

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/prestasi/" + updateID).update({
                                status_uprove: false,
                                poinPrestasi: poinPrestasiinput
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarPerpindahan', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifPerpindahan").value = values.nisn;
                        document.getElementById("nikVerifPerpindahan").value = values.nik;
                        document.getElementById("namaVerifPerpindahan").value = values.nama;
                        document.getElementById("alamatVerifPerpindahan").value = values.alamatzonasi;
                        document.getElementById("tglLahirVerifPerpindahan").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifPerpindahan").value = values.jarak;
                        document.getElementById("noSKLVerifPerpindahan").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifPerpindahan").value = values.nilai_skl;

                        document.getElementById("sekolahAsalSDPerpindahan").value = values.sekolah_asal;


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

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                status_uprove: true,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: true,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Succes')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Berhasil di Verifikasi',
                            })
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/perpindahan/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });
                $('body').on('click', '.updateDataDaftarZonasi', function () {
                    updateID = $(this).attr('data-id');
                    // window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifZonasi").value = values.nisn;
                        document.getElementById("nikVerifZonasi").value = values.nik;
                        document.getElementById("namaVerifZonasi").value = values.nama;
                        document.getElementById("alamatsiswaVerifZonasi").value = values.alamat;
                        document.getElementById("alamatVerifZonasi").value = values.alamatzonasi;
                        document.getElementById("sekolahVerifZonasi").value = values.sekolah_asal;
                        document.getElementById("tglLahirVerifZonasi").value = values.tanggal_lahir;
                        document.getElementById("jarakVerifZonasi").value = values.jarak;
                        document.getElementById("noSKLVerifZonasi").value = values.nomor_skl;
                        document.getElementById("nilaiSKLVerifZonasi").value = values.nilai_skl;
                        document.getElementById("noKKVerifZonasi").value = values.noKK;
                        document.getElementById("statusKKVerifZonasi").value = values.statusKK;
                        document.getElementById("desaVerifikasiZonasi").value = values.namaDesa;
                        document.getElementById("luarzona").value = values.luarzonasi;


                        if (values.koreksi == undefined) {
                            document.getElementById("koreksiTampil").value = 'Tidak Ada Pesan Koreksi';
                        } else {
                            document.getElementById("koreksiTampil").value = values.koreksi;
                        }
                        console.log(values.uid);

                        var idSD = values.id_sd;
                        var idSMP = values.sekolahZonasiId;


                        $scope.status_daftar = values.status_daftar;
                        console.log($scope.status_daftar);
                        if ($scope.status_daftar == true) {
                            document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        } else {
                            document.getElementById("chekdaftar").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        }


                        // firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                        //     var data = snapshot.val();
                        //     var url = data.URL
                        //     console.log(url);
                        //     if (url == null) {
                        //         console("file")
                        //     }

                        //     $scope.lihatFileSKL = function () {
                        //         window.open(url);
                        //     }

                        // })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.simpanAkses = function () {
                            var chekdaftar = document.getElementById("bukadaftar").value;

                            console.log(chekdaftar);

                            if (chekdaftar == 'on') {
                                firebase.database().ref('siswa/' + updateID).update({
                                    status_daftar: false,
                                    status_daftarJalur: false,
                                    status_daftarZonasi: false,
                                    status_skl: false,
                                    status_terima: false,
                                    status_uprove: false,
                                    status_skl: false,
                                });

                                firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                // firebase.database().ref('siswa/'+ updateID + '/file').remove();

                            } else {
                                console.log('TIDAK UPDATE');
                            }
                            // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Siswa Berhasil di Update',
                            })
                            $("#modal_edit-zonasi").modal('hide')
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });

                $('body').on('click', '.updateDataDaftarNull', function () {
                    // updateID = $(this).attr('data-id');
                    updateID = $(this).attr('data-id');
                    window.alert(updateID);
                    firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                        var values = snapshot.val();
                        document.getElementById("nisnVerifZonasiNULL").value = values.nisn;
                        document.getElementById("nikVerifZonasiNULL").value = values.nik;
                        document.getElementById("namaVerifZonasiNULL").value = values.nama;

                        var idSD = values.id_sd;
                        var idSMP = values.sekolahZonasiId;


                        $scope.status_daftar = values.status_daftar;
                        console.log($scope.status_daftar);
                        if ($scope.status_daftar == true) {
                            document.getElementById("chekdaftarNULL").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        } else {
                            document.getElementById("chekdaftarNULL").innerHTML = "<label class='toggledaftar'>\
                            <input type='checkbox' id='bukadaftar'>\
                            <span class='status roun'></span>\
                          </label>"
                        }


                        // firebase.database().ref('siswa/' + updateID + '/file').on('value', function (snapshot) {
                        //     var data = snapshot.val();
                        //     var url = data.URL
                        //     console.log(url);
                        //     if (url == null) {
                        //         console("file")
                        //     }

                        //     $scope.lihatFileSKL = function () {
                        //         window.open(url);
                        //     }

                        // })

                        var nama = values.nama
                        var id_sd = values.id_sd
                        $scope.simpanAkses = function () {
                            var chekdaftar = document.getElementById("bukadaftar").value;

                            console.log(chekdaftar);

                            if (chekdaftar == 'on') {
                                firebase.database().ref('siswa/' + updateID).update({
                                    status_daftar: false,
                                    status_daftarJalur: false,
                                    status_daftarZonasi: false,
                                    status_skl: false,
                                    status_terima: false,
                                    status_uprove: false,
                                    status_skl: false,
                                });

                                firebase.database().ref('sd/' + idSD + '/' + updateID).remove();
                                firebase.database().ref('smp/' + idSMP + '/zonasi/' + updateID).remove();
                                // firebase.database().ref('siswa/'+ updateID + '/file').remove();

                            } else {
                                console.log('TIDAK UPDATE');
                            }
                            // window.alert('Data Siswa' + nama + ' Berhasil di Update')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Siswa Berhasil di Update',
                            })
                            $("#modal_edit-zonasiNULL").modal('hide')
                        }

                        $scope.batalverifikasi_siswa = function () {

                            firebase.database().ref('siswa/' + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("smp/" + $scope.formData.npsn + "/zonasi/" + updateID).update({
                                status_uprove: false,
                            });

                            firebase.database().ref("sd/" + id_sd + "/" + updateID).update({
                                status_uprove: false,
                            });
                            // window.alert('Verifikasi Data ' + nama + ' Dibatalkan')
                            $("#modal_verif").modal('hide')
                            Swal.fire({
                                icon: 'success',
                                title: 'Sukses',
                                text: 'Data Verifikasi Dibatalkan',
                            })
                        }

                    });
                });

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });

        $scope.form = {
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
        }
        $scope.siswaTercecerCheck = function () {
            console.log('CHECK SISWA TERCECER')
            $ionicLoading.show()
            var ref1 = firebase.database().ref('siswa/');
            var listRef1 = $firebaseArray(ref1);
            listRef1.$loaded().then(function (response) {
                // console.log(response);
                for (i = 0; i < response.length; i++) {
                    if (response[i].status_daftar == true) {
                        if (response[i].status_terima2 == null) {
                            if (response[i].status_terima == false) {
                                // status_terimaPenyaluran
                                if (response[i].status_terimaPenyaluran != true) {
                                    console.log('Tidak lolos zonasi' + response[i].nisn + ' ' + response[i].sekolahZonasiId)
                                    firebase.database().ref('siswaTidakloloszona/' + response[i].uid).update({
                                        status_terima: false,
                                        finalPoin: response[i].finalPoin,
                                        id_sd: response[i].id_sd,
                                        jalur: "zonasi",
                                        jalurNama: "Zonasi",
                                        jarak: response[i].jarak,
                                        nama: response[i].nama,
                                        nisn: response[i].nisn,
                                        no_pendaftaran: response[i].no_pendaftaran,
                                        poinStatusKK: response[i].poinStatusKK,
                                        sekolah_asal: response[i].sekolah_asal,
                                        statusKK: response[i].statusKK,
                                        uid: response[i].uid

                                    }).then(function () {
                                        console.log('update siswa salurkan');
                                    });
                                } else {

                                }

                            }
                        } else {
                            if (response[i].status_terima2 == false) {
                                if (response[i].status_terima == false) {
                                    // console.log('Tidak lolos 2 Jalur ' + response[i].nisn)
                                }
                            }
                        }
                    } else {
                        if (response[i].nisn == undefined) {
                            console.log('BELUM DAFTAR ' + response[i].nisn + " " + response[i].$id)
                            firebase.database().ref('siswa/' + response[i].$id).remove();
                        } else {

                        }
                    }

                }
            }).then(function (response) {
                $ionicLoading.hide()
            })
        }

        // $scope.checkBelumDaftar = function () {
        //     console.log('CHECK SISWA TERCECER')
        //     $ionicLoading.show()
        //     var ref1 = firebase.database().ref('datasiswa/');
        //     var listRef1 = $firebaseArray(ref1);
        //     listRef1.$loaded().then(function (response) {
        //         console.log(response.length);
        //         for (i = 0; i < response.length; i++) {
        //             console.log(response[i].nisn)
        //         }
        //     }).then(function () {
        //         $ionicLoading.hide()
        //     })
        // }

        $scope.checkBelumDaftar = function () {
            console.log('JALAN')
            var ref = firebase.database().ref("siswa");
            var listRef = $firebaseArray(ref);

            var ref2 = firebase.database().ref("datasiswa");
            var listRef2 = $firebaseArray(ref2);

            listRef2.$loaded().then(function (response2) {
                console.log(response2);
                var arraydata = new Array();
                for (let index = 0; index < response2.length; index++) {
                    // console.log(response2[index].nisn);
                    arraydata.push(response2[index].nisn)
                    // if (response[index].nisn) {

                    // } else {

                    // }
                }
                console.log('ARRAY');
                console.log(arraydata);
                // $sc


                listRef.$loaded().then(function (response) {
                    console.log(response);
                    for (let index = 0; index < response.length; index++) {
                        // arraydata.includes("123456789")
                        if (arraydata.includes(response[index].nisn) == true) {
                            // console.log('DATA ADA');
                            // var datasiswaref = firebase.database().ref("datasiswa").child(response[index].nisn);
                            // var listDatasiswa = $firebaseArray(datasiswaref);
                            // listDatasiswa.$loaded().then(function (response3) {
                            //     // console.log(response3[8].$value);
                            //     $scope.nama = response3[8].$value;
                            //     // $scope.alamatsekolahzonasi = response3[1].$value;
                            //     // $scope.idDesa= response3[2].$value;
                            //     // $scope.idKecamatan = response3[3].$value;
                            //     // $scope.idsekolah_zonasi = response3[6].$value;
                            //     // $scope.kordinatzonasi= response3[7].$value;
                            //     // $scope.namaDesa = response3[9].$value;
                            //     // $scope.namaKecamatan= response3[10].$value;
                            //     // $scope.sekolah_zonasi = response3[15].$value;


                            //     // console.log("alamatsekolahzonasi :"+response3[1].$value)
                            //     // console.log("idDesa :" +response3[2].$value)
                            //     // console.log("idKecamatan :" +response3[3].$value)
                            //     // console.log("idsekolah_zonasi :"+response3[6].$value)
                            //     // console.log("kordinatzonasi :"+response3[7].$value)
                            //     // console.log("namaDesa :"+response3[9].$value)
                            //     // console.log("namaKecamatan :"+response3[10].$value)
                            //     // console.log("sekolah_zonasi :"+response3[15].$value)

                            //     // OFF
                            //     // firebase.database().ref('datasiswa/' + response[index].nisn).update({
                            //     //     nama: $scope.nama,

                            //     // }).then(function () {
                            //     //     console.log("Update " + index, response[index].nisn);
                            //     // })


                            //     // console.log(response3[0].$value);
                            //     // console.log("alamatsekolahzonasi :"+response3[1].$value)
                            //     // console.log("idDesa :" +response3[2].$value)
                            //     // console.log("idKecamatan :" +response3[3].$value)
                            //     // console.log("idsekolah_zonasi :"+response3[6].$value)
                            //     // console.log("kordinatzonasi :"+response3[7].$value)
                            //     // console.log("namaDesa :"+response3[9].$value)
                            //     // console.log("namaKecamatan :"+response3[10].$value)
                            //     // console.log("sekolah_zonasi :"+response3[15].$value)
                            //     // console.log("=============================================");

                            //     // $scope.namaDesa = response2[0].nama_desa;
                            //     // $scope.id_desa = response2[0].id_desa;


                            //     // $scope.sklhNama1 = response2[0].nama_smp;
                            //     // $scope.sklhId1 = response2[0].id_smp;
                            //     // $scope.sklhAlamat1 = response2[0].alamat_smp;

                            //     // // console.log("Update " + index, response[index].nisn , $scope.sklhNama1);


                            //     // firebase.database().ref('datasiswa/' + response[index].nisn).update({
                            //     //     sekolah_zonasi: $scope.sklhNama1,
                            //     //     idsekolah_zonasi: $scope.sklhId1,
                            //     //     alamatsekolahzonasi: $scope.sklhAlamat1

                            //     // }).then(function () {
                            //     //     console.log("Update " + index, response[index].nisn);
                            //     // }
                            //     // );

                            // });

                        } else {
                            console.log(response[index].nisn);
                        }
                    }
                    // $scope.siswa= response;
                    // $scope.jumlah_siswa = response.length;
                    // firebase.database().ref('jumlah').update({
                    //     jumlah_siswa : $scope.jumlah_siswa,
                    // })

                })
                // for (let index = 0; index < response.length; index++) {
                //     console.log(response[index].nisn);
                //     if (response[index].nisn) {

                //     } else {

                //     }
                // }
                // $scope.siswa= response;
                // $scope.jumlah_siswa = response.length;
                // firebase.database().ref('jumlah').update({
                //     jumlah_siswa : $scope.jumlah_siswa,
                // })

            })
        }

        $scope.EliminasiZonasi = function () {
            console.log('KLIK ELIMINASI ZONASI')
            $ionicLoading.show()
            var ref1 = firebase.database().ref('siswa/').orderByChild('status_terima2').equalTo(true);
            var listRef1 = $firebaseArray(ref1);
            listRef1.$loaded().then(function (response) {
                console.log(response);
                for (i = 0; i < response.length; i++) {
                    console.log(response[i].nisn + ' ELIMINASI DI : ' + response[i].sekolahZonasiId);
                    firebase.database().ref('smp/' + response[i].sekolahZonasiId + '/zonasi_rank/' + response[i].uid).remove();
                    // if (response[i].idsekolah_zonasi == response[i].sekolahZonasiId) {
                    //     console.log('AMAN')
                    // } else {
                    //     console.log('CHECK : '+response[i].nisn )
                    //     console.log(response[i].idsekolah_zonasi +' & '+ response[i].sekolahZonasiId)
                    // }
                    // if (idsekolah_zonasi == null) {
                    //     console.log(response[i].nisn);
                    // } else {

                    // }

                }
            }).then(function (response) {
                $ionicLoading.hide()
            })
        }

        $scope.RankingZonasi = function () {
            console.log('KLIK RANKING ZONASI')
            $ionicLoading.show()
            // // ################
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhZonasi = 0;
                // console.log("id smp : " + snapshot.key);

                // console.log('ID'+ value);
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/zonasi_rank').orderByChild('finalPoin');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaZonasi = parseInt(dataSnapShot1.val().kuota_zonasi);
                        if ($scope.kuotaZonasi != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhZonasi = jmlhZonasi + 1;
                                // listData.push(response[i]);
                                if (jmlhZonasi <= $scope.kuotaZonasi) {
                                    console.log('lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima: true,
                                    }).then(function () {
                                        console.log('update status_terima');
                                    })

                                    // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima: false,
                                    }).then(function () {
                                        console.log('update status_ditolak');
                                    });
                                    // firebase.database().ref('siswaTidakloloszona/' + response[i].uid).update({
                                    //     status_terima: false,
                                    //     finalPoin:response[i].finalPoin,
                                    //     id_sd:response[i].id_sd,
                                    //     jalur:"zonasi",
                                    //     jalurNama:"Zonasi",
                                    //     jarak:response[i].jarak,
                                    //     nama:response[i].nama,
                                    //     nisn:response[i].nisn,
                                    //     no_pendaftaran:response[i].no_pendaftaran,
                                    //     poinStatusKK:response[i].poinStatusKK,
                                    //     sekolah_asal:response[i].sekolah_asal,
                                    //     statusKK:response[i].statusKK,
                                    //     uid:response[i].uid

                                    // }).then(function () {
                                    //     console.log('update siswa salurkan');
                                    // });


                                    // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                                    //     status_terima: false,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima: false,
                                    // });
                                }
                            }

                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Zonasi : ' + $scope.kuotaZonasi);
                            console.log('Jumlah pendaftar Zonasi : ' + jmlhZonasi)
                            // no = no + 1;
                            console.log("=======");
                            // if ($scope.kuotaZonasi > jmlhZonasi) {
                            //     console.log(dataSnapShot1.val().sekolah)
                            //     console.log(" id smp : " + snapshot.key);
                            //     console.log('=======');
                            //     console.log('Jumlah Kuota Zonasi: ' + $scope.kuotaZonasi);
                            //     console.log('Jumlah pendaftar Zonasi : ' + jmlhZonasi)
                            //     // no = no + 1;
                            //     console.log("=======");
                            // } else {

                            // }

                            // $scope.pendaftar_siswa = listData;
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Zonasi : '+ $scope.kuotaZonasi);
                            // console.log('Jumlah pendaftar Zonasi : '+ jmlhZonasi)   
                        }

                    })
                    // console.log(response);
                }).then(function (response) {
                    $ionicLoading.hide()
                })
            });
            // // ################

        }

        $scope.RankingAfirmasi = function () {
            // // ################
            console.log('KLIK RANKING AFIRMASI')
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhAfirmasi = 0;
                // console.log("id smp : " + snapshot.key);

                // console.log('ID'+ value);
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/afirmasi_rank').orderByChild('finalPoin');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaAfirmasi = parseInt(dataSnapShot1.val().kuota_afirmasi);
                        if ($scope.kuotaAfirmasi != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhAfirmasi = jmlhAfirmasi + 1;
                                // listData.push(response[i]);
                                if (jmlhAfirmasi <= $scope.kuotaAfirmasi) {
                                    console.log('lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima2: true,
                                    });
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima: false,
                                    });

                                    // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima2: false,
                                    });
                                    // firebase.database().ref('siswa/' + response[i].uid).update({
                                    //     status_terima: false,
                                    // });

                                    // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                                    //     status_terima: false,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima: false,
                                    // });
                                }
                            }

                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Afirmasi : ' + $scope.kuotaAfirmasi);
                            console.log('Jumlah pendaftar Afirmasi : ' + jmlhAfirmasi)
                            // no = no + 1;
                            console.log("=======");
                            // if ($scope.kuotaAfirmasi > jmlhAfirmasi) {
                            //     console.log(dataSnapShot1.val().sekolah)
                            //     console.log(" id smp : " + snapshot.key);
                            //     console.log('=======');
                            //     console.log('Jumlah Kuota Afirmasi: ' + $scope.kuotaAfirmasi);
                            //     console.log('Jumlah pendaftar Afirmasi : ' + jmlhAfirmasi)
                            //     // no = no + 1;
                            //     console.log("=======");
                            // } else {

                            // }

                            // $scope.pendaftar_siswa = listData;
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Afirmasi : '+ $scope.kuotaAfirmasi);
                            // console.log('Jumlah pendaftar Afirmasi : '+ jmlhAfirmasi)   
                        }

                    })
                    // console.log(response);
                })
            });
            // // ################
        }
        $scope.RankingPrestasi = function () {
            console.log('KLIK RANKING PRESTASI')
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhPrestasi = 0;
                // console.log("id smp : " + snapshot.key);

                // console.log('ID'+ value);
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/prestasi_rank').orderByChild('poinPrestasiUrut');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaPrestasi = parseInt(dataSnapShot1.val().kuota_prestasi);
                        if ($scope.kuotaPrestasi != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhPrestasi = jmlhPrestasi + 1;

                                // if (response[i].poinPrestasi == 0) {
                                //     console.log('poin Nol')
                                //     firebase.database().ref('smp/' + snapshot.key + '/prestasi_rank/' + response[i].uid).update({
                                //         poinPrestasiUrut: 1000,
                                //     });
                                // } else {
                                //     console.log(parseFloat(100 / response[i].poinPrestasi));
                                //     firebase.database().ref('smp/' + snapshot.key + '/prestasi_rank/' + response[i].uid).update({
                                //         poinPrestasiUrut: parseFloat(100/response[i].poinPrestasi),
                                //     });
                                // }

                                // listData.push(response[i]);

                                // #################
                                if (jmlhPrestasi <= $scope.kuotaPrestasi) {
                                    console.log('lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima2: true,
                                    });
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima: false,
                                    });


                                    // firebase.database().ref('smp/' + snapshot.key + '/prestasi/' + response[i].uid).update({
                                    //     status_terima2: true,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima2: true,
                                    // });

                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima2: false,
                                    });

                                    // firebase.database().ref('smp/' + snapshot.key + '/prestasi/' + response[i].uid).update({
                                    //     status_terima2: false,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima2: false,
                                    // });
                                }
                                // #################
                            }
                            // if ($scope.kuotaPerpindahan > jmlhPerpindahan) {
                            //     console.log(dataSnapShot1.val().sekolah)
                            //     console.log(" id smp : " + snapshot.key);
                            //     console.log('=======');
                            //     console.log('Jumlah Kuota Perpindahan : ' + $scope.kuotaPerpindahan);
                            //     console.log('Jumlah pendaftar Perpindahan : ' + jmlhPerpindahan)
                            //     // no = no + 1;
                            //     console.log("=======");
                            // } else {

                            // }
                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Prestasi : ' + $scope.kuotaPrestasi);
                            console.log('Jumlah pendaftar Prestasi : ' + jmlhPrestasi)
                            // no = no + 1;
                            console.log("=======");
                            // if ($scope.kuotaPrestasi > jmlhPrestasi) {
                            //     console.log(dataSnapShot1.val().sekolah)
                            //     console.log(" id smp : " + snapshot.key);
                            //     console.log('=======');
                            //     console.log('Jumlah Kuota Prestasi : ' + $scope.kuotaPrestasi);
                            //     console.log('Jumlah pendaftar Prestasi : ' + jmlhPrestasi)
                            //     // no = no + 1;
                            //     console.log("=======");
                            // } else {

                            // }





                            // $scope.pendaftar_siswa = listData;
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Prestasi : '+ $scope.kuotaPrestasi);
                            // console.log('Jumlah pendaftar Prestasi : '+ jmlhPrestasi)   
                        }

                    })
                    // console.log(response);
                })
            });
        }
        $scope.RankingPerpindahan = function () {
            // // ################
            console.log('KLIK RANKING PERPINDAHAN')
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhPerpindahan = 0;
                // console.log("id smp : " + snapshot.key);

                // console.log('ID'+ value);
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/perpindahan_rank').orderByChild('finalPoin');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaPerpindahan = parseInt(dataSnapShot1.val().kuota_perpindahan);
                        if ($scope.kuotaPerpindahan != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhPerpindahan = jmlhPerpindahan + 1;
                                // listData.push(response[i]);
                                if (jmlhPerpindahan <= $scope.kuotaPerpindahan) {
                                    console.log('lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima2: true,
                                    });
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima: false,
                                    });

                                    // firebase.database().ref('siswa/' + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                    // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima: true,
                                    // });

                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                    firebase.database().ref('siswa/' + response[i].uid).update({
                                        status_terima2: false,
                                    });
                                    // firebase.database().ref('siswa/' + response[i].uid).update({
                                    //     status_terima: false,
                                    // });

                                    // firebase.database().ref('smp/' + snapshot.key + '/zonasi/' + response[i].uid).update({
                                    //     status_terima: false,
                                    // });

                                    // firebase.database().ref('sd/' + response[i].sekolah_asal_id + "/" + response[i].uid).update({
                                    //     status_terima: false,
                                    // });
                                }
                            }

                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Perpindahan : ' + $scope.kuotaPerpindahan);
                            console.log('Jumlah pendaftar Perpindahan : ' + jmlhPerpindahan)
                            // no = no + 1;
                            console.log("=======");

                            // if ($scope.kuotaPerpindahan > jmlhPerpindahan) {
                            //     console.log(dataSnapShot1.val().sekolah)
                            //     console.log(" id smp : " + snapshot.key);
                            //     console.log('=======');
                            //     console.log('Jumlah Kuota Perpindahan : ' + $scope.kuotaPerpindahan);
                            //     console.log('Jumlah pendaftar Perpindahan : ' + jmlhPerpindahan)
                            //     // no = no + 1;
                            //     console.log("=======");
                            // } else {

                            // }

                            // $scope.pendaftar_siswa = listData;
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Perpindahan : '+ $scope.kuotaPerpindahan);
                            // console.log('Jumlah pendaftar Perpindahan : '+ jmlhPerpindahan)   
                        }

                    })
                    // console.log(response);
                })
            });
            // // ################
        }

        $scope.checkDataKurang = function () {
            console.log('JALANKAN')
            $ionicLoading.show();
            var ref1 = firebase.database().ref('siswadatacocokan');
            var listRef1 = $firebaseArray(ref1);
            listRef1.$loaded().then(function (response) {
                console.log(response);
                for (i = 0; i < response.length; i++) {
                    // console.log(response[i].nisn)
                    if (response[i].nisn != undefined) {

                    } else {
                        firebase.database().ref('datasiswa/' + response[i].$id).on("value", function (snapshot) {
                            // console.log(snapshot.val().nisn);
                            firebase.database().ref('siswadatacocokan/' + snapshot.val().nisn).update({
                                jenis_kelamin: "-",
                                nama: snapshot.val().nama,
                                nama_ibu_kandung: "-",
                                nama_sekolah_asal: snapshot.val().sekolah_asal,
                                nik: snapshot.val().nik,
                                nisn: snapshot.val().nisn,
                                npsn_sekolah_asal: snapshot.val().id_sd,
                                peserta_didik_id: "-",
                                tanggal_lahir: snapshot.val().tanggal_lahir,
                                tempat_lahir: snapshot.val().tempat_lahir,
                                // npsn_sekolah_tujuan: response[i].sekolahJalurId,
                                // nama_sekolah_tujuan: response[i].sekolahJalur,
                            }).then(function () {
                                console.log('UPDATE DATA' + snapshot.val().nisn);
                            });
                        })
                        // var listRef2 = $firebaseArray(ref2);
                        // listRef2.$loaded().then(function (response2) {
                        //     console.log(response2);
                        // })

                    }
                }
            }).then(function (response) {
                $ionicLoading.hide()
            })
        }

        $scope.finalExport = function () {
            console.log('JALANKAN')
            $ionicLoading.show();
            var ref1 = firebase.database().ref('siswa/').orderByChild('status_terima2').equalTo(true);
            var listRef1 = $firebaseArray(ref1);
            listRef1.$loaded().then(function (response) {
                // console.log(response);
                for (i = 0; i < response.length; i++) {
                    // console.log(response[i].sekolahJalur + '' + response[i].sekolahJalurId)
                    if (response[i].sekolahJalur != undefined || response[i].sekolahJalurId != undefined) {
                        firebase.database().ref('siswadatacocokan/' + response[i].nisn).update({
                            npsn_sekolah_tujuan: response[i].sekolahJalurId,
                            nama_sekolah_tujuan: response[i].sekolahJalur,
                            jalur: response[i].jalurNama2,
                        }).then(function () {
                            console.log('UPDATE DATA')
                        });

                        // firebase.database().ref('siswadatacocokan/' + response[i].nisn).on("value", function (snapshot) {
                        //     if (snapshot.val() != null) {
                        //         // firebase.database().ref('siswadatacocokan/' + response[i].nisn).update({
                        //         //     npsn_sekolah_tujuan: response[i].sekolahJalurId,
                        //         //     nama_sekolah_tujuan: response[i].sekolahJalur,
                        //         // }).then(function () {
                        //         //     console.log('UPDATE DATA' + response[i].nisn )
                        //         // });
                        //         console.log('ADA DATA' + snapshot.val().nisn);
                        //         console.log($scope.temp_sekolahJalurId +' ' + $scope.temp_sekolahJalur)
                        //     }else{
                        //         // console.log('TADA BELUM ADA');
                        //     }
                        // })
                    } else {
                        console.log('chek' + response[i].nisn + ' ' + response[i].sekolahJalur + ' ' + response[i].sekolahJalurId);
                    }
                }
            }).then(function (response) {
                $ionicLoading.hide()
            })
        }

        $scope.finalExportZonasi = function () {
            console.log('JALANKAN')
            $ionicLoading.show();
            var ref1 = firebase.database().ref('siswa/').orderByChild('status_terima').equalTo(true);
            var listRef1 = $firebaseArray(ref1);
            listRef1.$loaded().then(function (response) {
                $scope.temp_sekolahJalur;
                $scope.temp_sekolahJalurId;
                console.log(response);
                for (i = 0; i < response.length; i++) {
                    if (response[i].status_terima2 == true) {
                        console.log('chek' + response[i].nisn);
                    } else {
                        if (response[i].sekolahZonasi != '' || response[i].sekolahZonasiId != '' || response[i].sekolahZonasi != undefined || response[i].sekolahZonasiId != undefined) {
                            firebase.database().ref('siswadatacocokan/' + response[i].nisn).update({
                                npsn_sekolah_tujuan: response[i].sekolahZonasiId,
                                nama_sekolah_tujuan: response[i].sekolahZonasi,
                                jalur: response[i].jalurNama,
                            }).then(function () {
                                console.log('UPDATE DATA')
                            });

                            // firebase.database().ref('siswadatacocokan/' + response[i].nisn).on("value", function (snapshot) {
                            //     if (snapshot.val() != null) {
                            //         // firebase.database().ref('siswadatacocokan/' + response[i].nisn).update({
                            //         //     npsn_sekolah_tujuan: response[i].sekolahJalurId,
                            //         //     nama_sekolah_tujuan: response[i].sekolahJalur,
                            //         // }).then(function () {
                            //         //     console.log('UPDATE DATA' + response[i].nisn )
                            //         // });
                            //         console.log('ADA DATA' + snapshot.val().nisn);
                            //         console.log($scope.temp_sekolahJalurId +' ' + $scope.temp_sekolahJalur)
                            //     }else{
                            //         // console.log('TADA BELUM ADA');
                            //     }
                            // })
                        } else {
                            console.log('chek' + response[i].nisn + ' ' + response[i].sekolahJalur + ' ' + response[i].sekolahJalurId);
                        }
                    }
                }
            }).then(function (response) {
                $ionicLoading.hide()
            })
        }


        $scope.exportpersekolah = function () {
            console.log('KLIK RANKING ZONASI')
            $ionicLoading.show()
            // // ################
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhZonasi = 0;
                // console.log("id smp : " + snapshot.key);

                // console.log('ID'+ value);
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/zonasi_rank').orderByChild('finalPoin');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaZonasi = parseInt(dataSnapShot1.val().kuota_zonasi);
                        if ($scope.kuotaZonasi != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhZonasi = jmlhZonasi + 1;
                                // listData.push(response[i]);
                                if (jmlhZonasi <= $scope.kuotaZonasi) {
                                    console.log('lolos : ', response[i].nisn);
                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                }
                            }

                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Zonasi : ' + $scope.kuotaZonasi);
                            console.log('Jumlah pendaftar Zonasi : ' + jmlhZonasi)
                            console.log("=======");
                            if ($scope.kuotaZonasi == jmlhZonasi) {
                                console.log('simpan jumlah pendaftar')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    zonasi: jmlhZonasi,
                                });
                            } else if($scope.kuotaZonasi > jmlhZonasi){
                                console.log('simpan jumlah pendaftar 2')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    zonasi: jmlhZonasi,
                                });
                            }else if($scope.kuotaZonasi < jmlhZonasi){
                                console.log('simpan jumlah Kuota')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    zonasi: $scope.kuotaZonasi,
                                });
                            }
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Zonasi : '+ $scope.kuotaZonasi);
                            // console.log('Jumlah pendaftar Zonasi : '+ jmlhZonasi)   
                        }

                    })
                    // console.log(response);
                }).then(function (response) {
                    $ionicLoading.hide()
                })
            });
            // // ################
        }

        $scope.exportpersekolahPrestasi = function () {
            // // ################
            console.log('KLIK RANKING PRESTASI')
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhPrestasi = 0;
                // console.log("id smp : " + snapshot.key);

                // console.log('ID'+ value);
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/prestasi_rank').orderByChild('poinPrestasiUrut');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaPrestasi = parseInt(dataSnapShot1.val().kuota_prestasi);
                        if ($scope.kuotaPrestasi != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhPrestasi = jmlhPrestasi + 1;
                                // #################
                                if (jmlhPrestasi <= $scope.kuotaPrestasi) {
                                    console.log('lolos : ', response[i].nisn);
                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                }
                                // #################
                            }
                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Prestasi : ' + $scope.kuotaPrestasi);
                            console.log('Jumlah pendaftar Prestasi : ' + jmlhPrestasi)
                            console.log("=======");
                            if ($scope.kuotaPrestasi == jmlhPrestasi) {
                                console.log('simpan jumlah pendaftar')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    prestasi: jmlhPrestasi,
                                });
                            } else if($scope.kuotaPrestasi > jmlhPrestasi){
                                console.log('simpan jumlah pendaftar 2')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    prestasi: jmlhPrestasi,
                                });
                            }else if($scope.kuotaPrestasi < jmlhPrestasi){
                                console.log('simpan jumlah Kuota')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    prestasi: $scope.kuotaPrestasi,
                                });
                            }
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Prestasi : '+ $scope.kuotaPrestasi);
                            // console.log('Jumlah pendaftar Prestasi : '+ jmlhPrestasi)   
                        }

                    })
                    // console.log(response);
                })
            });
            // // ################
        }

        $scope.exportpersekolahPerpindahan = function () {
            // // ################
            console.log('KLIK RANKING PERPINDAHAN')
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhPerpindahan = 0;
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/perpindahan_rank').orderByChild('finalPoin');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaPerpindahan = parseInt(dataSnapShot1.val().kuota_perpindahan);
                        if ($scope.kuotaPerpindahan != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhPerpindahan = jmlhPerpindahan + 1;
                                if (jmlhPerpindahan <= $scope.kuotaPerpindahan) {
                                    console.log('lolos : ', response[i].nisn);
                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                }
                            }

                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Perpindahan : ' + $scope.kuotaPerpindahan);
                            console.log('Jumlah pendaftar Perpindahan : ' + jmlhPerpindahan)
                            console.log("=======");
                            if ($scope.kuotaPerpindahan == jmlhPerpindahan) {
                                console.log('simpan jumlah pendaftar')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    perpindahan: jmlhPerpindahan,
                                });
                            } else if($scope.kuotaPerpindahan > jmlhPerpindahan){
                                console.log('simpan jumlah pendaftar 2')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    perpindahan: jmlhPerpindahan,
                                });
                            }else if($scope.kuotaPerpindahan < jmlhPerpindahan){
                                console.log('simpan jumlah Kuota')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    perpindahan: $scope.kuotaPerpindahan,
                                });
                            }
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Perpindahan : '+ $scope.kuotaPerpindahan);
                            // console.log('Jumlah pendaftar Perpindahan : '+ jmlhPerpindahan)   
                        }

                    })
                    // console.log(response);
                })
            });
            // // ################
        }

        $scope.exportpersekolahAfirmasi = function () {
            // // ################
            console.log('KLIK RANKING AFIRMASI')
            var no = 0;
            var listData = [];
            var ref = firebase.database().ref("smp").on("child_added", function (snapshot, prevChildKey) {
                var value = snapshot.val();
                var numChild = snapshot.numChildren();
                var jmlhAfirmasi = 0;
                var ref1 = firebase.database().ref('smp/' + snapshot.key + '/afirmasi_rank').orderByChild('finalPoin');
                var listRef1 = $firebaseArray(ref1);
                listRef1.$loaded().then(function (response) {
                    firebase.database().ref('sekolah').child(snapshot.key).on('value', (dataSnapShot1) => {
                        $scope.kuotaAfirmasi = parseInt(dataSnapShot1.val().kuota_afirmasi);
                        if ($scope.kuotaAfirmasi != 0) {
                            for (i = 0; i < response.length; i++) {
                                jmlhAfirmasi = jmlhAfirmasi + 1;
                                // listData.push(response[i]);
                                if (jmlhAfirmasi <= $scope.kuotaAfirmasi) {
                                    console.log('lolos : ', response[i].nisn);
                                } else {
                                    console.log('tidak lolos : ', response[i].nisn);
                                }
                            }

                            console.log(dataSnapShot1.val().sekolah)
                            console.log(" id smp : " + snapshot.key);
                            console.log('=======');
                            console.log('Jumlah Kuota Afirmasi : ' + $scope.kuotaAfirmasi);
                            console.log('Jumlah pendaftar Afirmasi : ' + jmlhAfirmasi);
                            if ($scope.kuotaAfirmasi == jmlhAfirmasi) {
                                console.log('simpan jumlah pendaftar')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    afirmasi: jmlhAfirmasi,
                                });
                            } else if($scope.kuotaAfirmasi > jmlhAfirmasi){
                                console.log('simpan jumlah pendaftar 2')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    afirmasi: jmlhAfirmasi,
                                });
                            }else if($scope.kuotaAfirmasi < jmlhAfirmasi){
                                console.log('simpan jumlah Kuota')
                                firebase.database().ref('rekap_smp/' + snapshot.key).update({
                                    afirmasi: $scope.kuotaAfirmasi,
                                });
                            }
                            console.log("=======");
                        } else {
                            // console.log("KUOTA AFIRMASI 0");
                            // console.log('Jumlah Kuota Afirmasi : '+ $scope.kuotaAfirmasi);
                            // console.log('Jumlah pendaftar Afirmasi : '+ jmlhAfirmasi)   
                        }

                    })
                    // console.log(response);
                })
            });
            // // ################
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

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');

        }
        $scope.data_pendaftar_smp = function () {
            $state.go('dataPendaftarAdminSuper');
        }

        $scope.pengaturan = function () {
            $state.go('pengaturanAdminSuper');
        }

    }])
