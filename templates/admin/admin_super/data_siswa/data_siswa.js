angular.module('app.dataSiswa', [])

    .controller('dataSiswaCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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

        $ionicLoading.show();

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

        var ref = firebase.database().ref("datasiswa");
        var listRef = $firebaseArray(ref);

        listRef.$loaded().then(function (response) {
            console.log(response);
            $scope.siswa = response;
            $scope.jumlah_siswa = response.length;
            firebase.database().ref('jumlah').update({
                jumlah_siswa: $scope.jumlah_siswa,
            })

        })


        $ionicLoading.hide();

        $scope.form = {
            "jenjang": "SMP",
            "status": "",
            "namaSekolah": "",
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
            "alamatSekolah": "",
            "npsn": "",
            "idDesa": "",
        }

        var refKecamatan = firebase.database().ref("kecamatan");
        $scope.dataKecamatan = $firebaseArray(refKecamatan);
        // console.log($scope.dataKecamatan);

        var refSekolah = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo('SD');;
        $scope.dataSekolah = $firebaseArray(refSekolah);

        $scope.getIdKecamatan = function () {
            var idKecamatan = $scope.form.idKecamatan;
            $scope.idKecamatan = $scope.form.idKecamatan;
            //Get Nama Kecamatan
            var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
            var listNamaKecamatan = $firebaseArray(namaKecamatan);
            listNamaKecamatan.$loaded().then(function (response) {
                $scope.namaKecamatan = response[0].nama_kecamatan;
                $scope.id_kecamatan = response[0].id_kecamatan;
                console.log($scope.id_kecamatan);

            });

            var refDesa = firebase.database().ref("desa").orderByChild("id_kecamatan").equalTo(idKecamatan);
            $scope.dataDesa = $firebaseArray(refDesa);
            // console.log($scope.dataKecamatan);
        }
        var refDesa = firebase.database().ref("desa");
        $scope.dataDesa = $firebaseArray(refDesa);

        $scope.getIdDesa = function () {
            var idDesa = $scope.form.idDesa;
            $scope.idDesa = $scope.form.idDesa;
            //Get Nama Kecamatan
            var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
            var listNamaDesa = $firebaseArray(namaDesa);
            listNamaDesa.$loaded().then(function (response) {
                $scope.namaDesa = response[0].nama_desa;
                $scope.id_desa = response[0].id_desa;
                $scope.sklhNama = response[0].nama_smp;
                $scope.sklhId = response[0].id_smp;
                $scope.sklhAlamat = response[0].alamat_smp;
                console.log($scope.id_desa);
                console.log($scope.sklhId);
                $scope.sklhNama1 = response[0].nama_smp;
                $scope.sklhId1 = response[0].id_smp;
                $scope.sklhAlamat1 = response[0].alamat_smp;

            });

            // var refBanjar = firebase.database().ref("banjar").orderByChild("id_desa").equalTo(idDesa);
            // $scope.dataBanjar = $firebaseArray(refBanjar);
        }
        $scope.getIdKecamatanNew = function () {
            var idKecamatan = $scope.form.idKecamatan;
            $scope.idKecamatan = $scope.form.idKecamatan;
            //Get Nama Kecamatan
            var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
            var listNamaKecamatan = $firebaseArray(namaKecamatan);
            listNamaKecamatan.$loaded().then(function (response) {
                $scope.namaKecamatan = response[0].nama_kecamatan;
                $scope.id_kecamatan = response[0].id_kecamatan;

            });

            var refDesa = firebase.database().ref("desa").orderByChild("id_kecamatan").equalTo(idKecamatan);
            // var refDesa = firebase.database().ref("desa");
            $scope.dataDesanew = $firebaseArray(refDesa);
        }

        $scope.getIdDesaNew = function () {
            var idDesa = $scope.form.idDesa;
            $scope.idDesa = $scope.form.idDesa;
            //Get Nama Kecamatan
            var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
            var listNamaDesa = $firebaseArray(namaDesa);
            listNamaDesa.$loaded().then(function (response) {
                $scope.namaDesa = response[0].nama_desa;
                $scope.id_desa = response[0].id_desa;


                $scope.sklhNama1 = response[0].nama_smp;
                $scope.sklhId1 = response[0].id_smp;
                $scope.sklhAlamat1 = response[0].alamat_smp;

            });

        }
        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-siswa'));
            XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
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
                    $ionicLoading.hide();
                    // window.alert('Upload Sukses');
                    // $("#form-tambah-siswa-rayon").reset();
                    $("#modal_tambah").modal('hide');
                    $('.modal-backdrop').remove();
                    // $state.go("menuAdmin.dataSekolahAdmin")
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Ditambahkan',
                    })
                })

            }
            else {
                $ionicLoading.hide();
                // window.alert('Data Belum Lengkap');
                Swal.fire({
                    icon: 'success',
                    title: 'Sukses',
                    text: 'Data Belum Lengkap',
                })

            }
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

        // $scope.jalan = function () {
        //     console.log('JALAN')
        //     var ref = firebase.database().ref("datasiswa");
        //     var listRef = $firebaseArray(ref);

        //     listRef.$loaded().then(function (response) {
        //         console.log(response);
        //         for (let index = 0; index < response.length; index++) {
        //             if (response[index].sekolah_zonasi != undefined) {
        //                 console.log('SKIP')
        //             } else {
        //                 console.log("SekolahZonasi kosong" + index, response[index].nisn);
        //                 // firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //                 //     namaDesa: "-",
        //                 //     namaKecamatan: "-",

        //                 // }).then(function () {
        //                 //     console.log("Update " + index, response[index].nisn);
        //                 // })
        //             }



        //         }

        //     })
        // }


        // $scope.jalan = function () {
        //     console.log('JALAN')
        //     var ref = firebase.database().ref("datasiswa");
        //     var listRef = $firebaseArray(ref);

        //     var ref2 = firebase.database().ref("datasiswa2");
        //     var listRef2 = $firebaseArray(ref2);

        //     listRef2.$loaded().then(function (response2) {
        //         console.log(response2);
        //         var arraydata = new Array();
        //         for (let index = 0; index < response2.length; index++) {
        //             // console.log(response2[index].nisn);
        //             arraydata.push(response2[index].nisn)
        //             // if (response[index].nisn) {

        //             // } else {

        //             // }
        //         }
        //         console.log('ARRAY');
        //         console.log(arraydata);
        //         // $sc


        //         listRef.$loaded().then(function (response) {
        //             console.log(response);
        //             for (let index = 0; index < response.length; index++) {
        //                 // arraydata.includes("123456789")
        //                 if (arraydata.includes(response[index].nisn) == true) {
        //                     console.log('DATA ADA');
        //                     var datasiswaref = firebase.database().ref("datasiswa2").child(response[index].nisn);
        //                     var listDatasiswa = $firebaseArray(datasiswaref);
        //                     listDatasiswa.$loaded().then(function (response3) {
        //                         console.log(response3[8].$value);
        //                         $scope.nama = response3[8].$value;
        //                         // $scope.alamatsekolahzonasi = response3[1].$value;
        //                         // $scope.idDesa= response3[2].$value;
        //                         // $scope.idKecamatan = response3[3].$value;
        //                         // $scope.idsekolah_zonasi = response3[6].$value;
        //                         // $scope.kordinatzonasi= response3[7].$value;
        //                         // $scope.namaDesa = response3[9].$value;
        //                         // $scope.namaKecamatan= response3[10].$value;
        //                         // $scope.sekolah_zonasi = response3[15].$value;


        //                         // console.log("alamatsekolahzonasi :"+response3[1].$value)
        //                         // console.log("idDesa :" +response3[2].$value)
        //                         // console.log("idKecamatan :" +response3[3].$value)
        //                         // console.log("idsekolah_zonasi :"+response3[6].$value)
        //                         // console.log("kordinatzonasi :"+response3[7].$value)
        //                         // console.log("namaDesa :"+response3[9].$value)
        //                         // console.log("namaKecamatan :"+response3[10].$value)
        //                         // console.log("sekolah_zonasi :"+response3[15].$value)

        //                         // OFF
        //                         firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //                             nama: $scope.nama,

        //                         }).then(function () {
        //                             console.log("Update " + index, response[index].nisn);
        //                         })


        //                         // console.log(response3[0].$value);
        //                         // console.log("alamatsekolahzonasi :"+response3[1].$value)
        //                         // console.log("idDesa :" +response3[2].$value)
        //                         // console.log("idKecamatan :" +response3[3].$value)
        //                         // console.log("idsekolah_zonasi :"+response3[6].$value)
        //                         // console.log("kordinatzonasi :"+response3[7].$value)
        //                         // console.log("namaDesa :"+response3[9].$value)
        //                         // console.log("namaKecamatan :"+response3[10].$value)
        //                         // console.log("sekolah_zonasi :"+response3[15].$value)
        //                         // console.log("=============================================");

        //                         // $scope.namaDesa = response2[0].nama_desa;
        //                         // $scope.id_desa = response2[0].id_desa;


        //                         // $scope.sklhNama1 = response2[0].nama_smp;
        //                         // $scope.sklhId1 = response2[0].id_smp;
        //                         // $scope.sklhAlamat1 = response2[0].alamat_smp;

        //                         // // console.log("Update " + index, response[index].nisn , $scope.sklhNama1);


        //                         // firebase.database().ref('datasiswa/' + response[index].nisn).update({
        //                         //     sekolah_zonasi: $scope.sklhNama1,
        //                         //     idsekolah_zonasi: $scope.sklhId1,
        //                         //     alamatsekolahzonasi: $scope.sklhAlamat1

        //                         // }).then(function () {
        //                         //     console.log("Update " + index, response[index].nisn);
        //                         // }
        //                         // );

        //                     });

        //                 } else {
        //                     console.log('SKIP');
        //                 }
        //             }
        //             // $scope.siswa= response;
        //             // $scope.jumlah_siswa = response.length;
        //             // firebase.database().ref('jumlah').update({
        //             //     jumlah_siswa : $scope.jumlah_siswa,
        //             // })

        //         })
        //         // for (let index = 0; index < response.length; index++) {
        //         //     console.log(response[index].nisn);
        //         //     if (response[index].nisn) {

        //         //     } else {

        //         //     }
        //         // }
        //         // $scope.siswa= response;
        //         // $scope.jumlah_siswa = response.length;
        //         // firebase.database().ref('jumlah').update({
        //         //     jumlah_siswa : $scope.jumlah_siswa,
        //         // })

        //     })
        // }


        $scope.jalan = function () {
            console.log('JALAN')
            $ionicLoading.show()
            var ref = firebase.database().ref("datasiswa");
            var listRef = $firebaseArray(ref);

            listRef.$loaded().then(function (response) {
                console.log(response);
                for (let index = 0; index < response.length; index++) {

                    if (response[index].idBanjar == "-") {
                        // console.log(index, response[index].nisn, 'TIDAK ADA ID DESA')
                        // console.log('SKIP STRIP')
                    } else {
                        var namaDesa = firebase.database().ref("banjar/" + response[index].idBanjar)
                        var listNamaDesa = $firebaseArray(namaDesa);
                        listNamaDesa.$loaded().then(function (response2) {
                            // console.log(response2[0])
                            if (response2[0] == undefined) {

                            } else {
                                // $scope.namaDesa = response2[0].nama_desa;
                                // $scope.id_desa = response2[0].id_desa;
                                $scope.sklhNama1 = response2[7].$value;
                                $scope.sklhId1 = response2[4].$value;
                                $scope.sklhAlamat1 = response2[0].$value;

                                // console.log('UBAH')
                                $ionicLoading.hide()
                                firebase.database().ref('datasiswa/' + response[index].nisn).update({
                                    sekolah_zonasi: $scope.sklhNama1,
                                    idsekolah_zonasi: $scope.sklhId1,
                                    alamatsekolahzonasi: $scope.sklhAlamat1,
                                    // namaDesa: $scope.namaDesa,
                                    // nama_desa: $scope.namaDesa

                                }).then(function () {
                                    console.log("Update");
                                    $ionicLoading.hide()
                                }
                                );
                            }


                            // if (response[index].alamatsekolahzonasi == $scope.sklhAlamat1 && response[index].idsekolah_zonasi == $scope.sklhId1) {
                            //     console.log('SKIP ALAMAT SEKOLAH   & ID SEKOLAH ZONASI SESUAI')
                            // } else {
                            //     console.log('UBAH')
                            //     $ionicLoading.hide()
                            //     firebase.database().ref('datasiswa/' + response[index].nisn).update({
                            //         sekolah_zonasi: $scope.sklhNama1,
                            //         idsekolah_zonasi: $scope.sklhId1,
                            //         alamatsekolahzonasi: $scope.sklhAlamat1,
                            //         // namaDesa: $scope.namaDesa,
                            //         // nama_desa: $scope.namaDesa

                            //     }).then(function () {
                            //         console.log("Update ");
                            //         $ionicLoading.hide()
                            //     }
                            //     );
                            // }


                        });
                        // if (response[index].idsekolah_zonasi =="-") {
                        //     console.log('SKIP')
                        // } else {



                        // }
                    }



                }
                // $scope.siswa= response;
                // $scope.jumlah_siswa = response.length;
                // firebase.database().ref('jumlah').update({
                //     jumlah_siswa : $scope.jumlah_siswa,
                // })

            })
        }

        //UPDATE
        var updateID = '';
        $('body').on('click', '.updateData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('datasiswa/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("nisnEdit").value = values.nisn;
                document.getElementById("nikEdit").value = values.nik;
                document.getElementById("namaEdit").value = values.nama;
                document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                document.getElementById("alamatEdit").value = values.alamat;
                document.getElementById("KecamatanEdit").value = values.namaKecamatan;
                document.getElementById("DesaEdit").value = values.namaDesa;
                document.getElementById("BanjarEdit").value = values.namaBanjar;
                document.getElementById("ValidasiEdit").value = values.chekKordinat;
                // $scope.idKecamatanEdit = values.idKecamatan;
                // $scope.idDesaEdit = values.idDesa;
                console.log(values.chekKordinat);
                if (values.kordinatzonasi == undefined) {
                    document.getElementById("kordinatEdit").value = '0,0';
                } else {
                    document.getElementById("kordinatEdit").value = values.kordinatzonasi;
                }
            });
        });

        // SIMPAN HASIL EDIT

        // $scope.simpanEditSiswaAdmin = function () {
        //     var updtNisn = document.getElementById("nisnEdit").value;
        //     var updtNik = document.getElementById("nikEdit").value;
        //     var updtNama = document.getElementById("namaEdit").value;
        //     var updtTglLahir = document.getElementById("tglLahirEdit").value;
        //     var updtTmptLahir = document.getElementById("tempatLahirEdit").value;
        //     var updtAlamat = document.getElementById("alamatEdit").value;
        //     var updtKordinat = document.getElementById("kordinatEdit").value;
        //     var updtKecamatan = document.getElementById("KecamatanEdit").value;
        //     var updtDesa = document.getElementById("DesaEdit").value;
        //     var updtValidasi = document.getElementById("ValidasiEdit").value;

        //     var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');

        //     console.log(updtKecamatan, updtDesa, $scope.namaDesa, $scope.id_desa);
        //     // console.log($scope.tempKordinat)

        //     // if (updtNisn.length > 0 && updtNik.length > 0 && updtNama.length > 0 && updtTmptLahir.length > 0 && updtAlamat.length > 0 && updtKordinat.length > 0) {
        //     //     if (updtKecamatan != '' && updtDesa != '' && updtKecamatan != '' && updtDesa != '') {
        //     //         if ($scope.form.idKecamatan == undefined && $scope.form.idDesa == undefined && $scope.tempKordinat == updtKordinat) {
        //     //             $("#modal_edit").modal('hide');
        //     //             Swal.fire({
        //     //                 icon: 'warning',
        //     //                 title: 'Perhatian',
        //     //                 text: 'Tidak Ada Edit Data alamat, Data Tidak Berubah',
        //     //             })
        //     //         } else {
        //     //             if ($scope.form.idKecamatan != undefined && $scope.form.idDesa == undefined) {
        //     //                 // @@@@@

        //     //                 firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
        //     //                     // console.log(snapshot.val());
        //     //                     $ionicLoading.show()
        //     //                     if (snapshot.val() != null) {
        //     //                         snapshot.forEach(function (data) {
        //     //                             console.log(data.key);
        //     //                             $ionicLoading.hide()
        //     //                             firebase.database().ref('siswa/' + data.key).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 alamatzonasi: updtKordinat,
        //     //                                 idDesa: updtDesa,
        //     //                                 idKecamatan: updtKecamatan,
        //     //                                 // namaDesa: $scope.namaDesa,
        //     //                                 namaKecamatan: $scope.namaKecamatan,
        //     //                                 sekolahZonasi: $scope.sklhNama1,
        //     //                                 idsekolah_zonasi: $scope.sklhId1,
        //     //                                 sekolahZonasiAlamat: $scope.sklhAlamat1
        //     //                             }).then(function () {
        //     //                                 console.log('EDIT /SISWA');
        //     //                                 firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                     alamat: updtAlamat,
        //     //                                     // nama: updtNama,
        //     //                                     // tempat_lahir: updtTmptLahir,
        //     //                                     kordinatzonasi: updtKordinat,
        //     //                                     idDesa: updtDesa,
        //     //                                     idKecamatan: updtKecamatan,
        //     //                                     // namaDesa: $scope.namaDesa,
        //     //                                     namaKecamatan: $scope.namaKecamatan,
        //     //                                     sekolah_zonasi: $scope.sklhNama1,
        //     //                                     idsekolah_zonasi: $scope.sklhId1,
        //     //                                     alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                     chekKordinat: updtValidasi,

        //     //                                 }).then(function () {
        //     //                                     $("#modal_edit").modal('hide');
        //     //                                     Swal.fire({
        //     //                                         icon: 'success',
        //     //                                         title: 'Success',
        //     //                                         text: 'Data Berhasil di update',
        //     //                                     })


        //     //                                     $scope.form.idKecamatan = undefined;
        //     //                                     $scope.form.idDesa = undefined;
        //     //                                 })
        //     //                             })
        //     //                         })

        //     //                     } else {
        //     //                         $ionicLoading.hide()
        //     //                         if ($scope.sklhNama1 != undefined && $scope.sklhId1 != undefined) {
        //     //                             console.log('EDI1');
        //     //                             console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //                             firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 kordinatzonasi: updtKordinat,
        //     //                                 idDesa: updtDesa,
        //     //                                 idKecamatan: updtKecamatan,
        //     //                                 // namaDesa: $scope.namaDesa,
        //     //                                 namaKecamatan: $scope.namaKecamatan,
        //     //                                 sekolah_zonasi: $scope.sklhNama1,
        //     //                                 idsekolah_zonasi: $scope.sklhId1,
        //     //                                 alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                 chekKordinat: updtValidasi,
        //     //                             }).then(function () {
        //     //                                 $("#modal_edit").modal('hide');
        //     //                                 Swal.fire({
        //     //                                     icon: 'success',
        //     //                                     title: 'Success',
        //     //                                     text: 'Data Berhasil di update',
        //     //                                 })


        //     //                                 $scope.form.idKecamatan = undefined;
        //     //                                 $scope.form.idDesa = undefined;
        //     //                             });
        //     //                         } else {
        //     //                             firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 kordinatzonasi: updtKordinat,
        //     //                                 // idDesa: updtDesa,
        //     //                                 // idKecamatan: updtKecamatan,
        //     //                                 // // namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 // sekolah_zonasi: $scope.sklhNama1,
        //     //                                 // idsekolah_zonasi: $scope.sklhId1,
        //     //                                 // alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                 chekKordinat: updtValidasi,
        //     //                             }).then(function () {
        //     //                                 $("#modal_edit").modal('hide');
        //     //                                 Swal.fire({
        //     //                                     icon: 'success',
        //     //                                     title: 'Success',
        //     //                                     text: 'Data Berhasil di update',
        //     //                                 })


        //     //                                 $scope.form.idKecamatan = undefined;
        //     //                                 $scope.form.idDesa = undefined;
        //     //                             });
        //     //                             // $("#modal_edit").modal('hide');
        //     //                             // Swal.fire({
        //     //                             //     icon: 'warning',
        //     //                             //     title: 'Perhatian',
        //     //                             //     text: 'Sekolah Tujuan Tidak ditemukan kode 1',
        //     //                             // })

        //     //                         }
        //     //                         // location.reload();
        //     //                     }
        //     //                 })
        //     //                 // @@@@@
        //     //             } else if ($scope.form.idKecamatan == undefined && $scope.form.idDesa != undefined) {
        //     //                 // @@@@@
        //     //                 firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
        //     //                     // console.log(snapshot.val());
        //     //                     $ionicLoading.show()
        //     //                     if (snapshot.val() != null) {
        //     //                         snapshot.forEach(function (data) {
        //     //                             console.log(data.key);
        //     //                             $ionicLoading.hide()
        //     //                             firebase.database().ref('siswa/' + data.key).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 alamatzonasi: updtKordinat,
        //     //                                 idDesa: updtDesa,
        //     //                                 idKecamatan: updtKecamatan,
        //     //                                 namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 sekolahZonasi: $scope.sklhNama1,
        //     //                                 idsekolah_zonasi: $scope.sklhId1,
        //     //                                 sekolahZonasiAlamat: $scope.sklhAlamat1
        //     //                             }).then(function () {
        //     //                                 console.log('EDIT /SISWA');
        //     //                                 firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                     alamat: updtAlamat,
        //     //                                     // nama: updtNama,
        //     //                                     // tempat_lahir: updtTmptLahir,
        //     //                                     kordinatzonasi: updtKordinat,
        //     //                                     idDesa: updtDesa,
        //     //                                     idKecamatan: updtKecamatan,
        //     //                                     namaDesa: $scope.namaDesa,
        //     //                                     // namaKecamatan: $scope.namaKecamatan,
        //     //                                     sekolah_zonasi: $scope.sklhNama1,
        //     //                                     idsekolah_zonasi: $scope.sklhId1,
        //     //                                     alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                     chekKordinat: updtValidasi

        //     //                                 }).then(function () {
        //     //                                     $("#modal_edit").modal('hide');
        //     //                                     Swal.fire({
        //     //                                         icon: 'success',
        //     //                                         title: 'Success',
        //     //                                         text: 'Data Berhasil di update',
        //     //                                     })


        //     //                                     $scope.form.idKecamatan = undefined;
        //     //                                     $scope.form.idDesa = undefined;
        //     //                                 })
        //     //                             })
        //     //                         })

        //     //                     } else {
        //     //                         $ionicLoading.hide()
        //     //                         if ($scope.sklhNama1 != undefined && $scope.sklhId1 != undefined) {
        //     //                             console.log('EDI1');
        //     //                             console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //                             firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 kordinatzonasi: updtKordinat,
        //     //                                 idDesa: updtDesa,
        //     //                                 idKecamatan: updtKecamatan,
        //     //                                 namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 sekolah_zonasi: $scope.sklhNama1,
        //     //                                 idsekolah_zonasi: $scope.sklhId1,
        //     //                                 alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                 chekKordinat: updtValidasi,
        //     //                             }).then(function () {
        //     //                                 $("#modal_edit").modal('hide');
        //     //                                 Swal.fire({
        //     //                                     icon: 'success',
        //     //                                     title: 'Success',
        //     //                                     text: 'Data Berhasil di update',
        //     //                                 })


        //     //                                 $scope.form.idKecamatan = undefined;
        //     //                                 $scope.form.idDesa = undefined;
        //     //                             });
        //     //                         } else {
        //     //                             console.log('EDI2');
        //     //                             console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //                             firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 kordinatzonasi: updtKordinat,
        //     //                                 idDesa: updtDesa,
        //     //                                 idKecamatan: updtKecamatan,
        //     //                                 namaDesa: $scope.namaDesa,
        //     //                                 namaKecamatan: $scope.namaKecamatan,
        //     //                                 sekolah_zonasi: $scope.sklhNama1,
        //     //                                 idsekolah_zonasi: $scope.sklhId1,
        //     //                                 alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                 chekKordinat: updtValidasi,
        //     //                             }).then(function () {
        //     //                                 $("#modal_edit").modal('hide');
        //     //                                 Swal.fire({
        //     //                                     icon: 'success',
        //     //                                     title: 'Success',
        //     //                                     text: 'Data Berhasil di update',
        //     //                                 })


        //     //                                 $scope.form.idKecamatan = undefined;
        //     //                                 $scope.form.idDesa = undefined;
        //     //                             });
        //     //                             // $("#modal_edit").modal('hide');
        //     //                             // Swal.fire({
        //     //                             //     icon: 'warning',
        //     //                             //     title: 'Perhatian',
        //     //                             //     text: 'Sekolah Tujuan Tidak ditemukan kode 2',
        //     //                             // })

        //     //                         }
        //     //                         // location.reload();
        //     //                     }
        //     //                 })
        //     //                 // @@@@@
        //     //             } else if ($scope.form.idKecamatan != undefined && $scope.form.idDesa != undefined) {
        //     //                 // @@@@@
        //     //                 firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
        //     //                     // console.log(snapshot.val());
        //     //                     $ionicLoading.show()
        //     //                     if (snapshot.val() != null) {
        //     //                         snapshot.forEach(function (data) {
        //     //                             console.log(data.key);
        //     //                             $ionicLoading.hide()
        //     //                             firebase.database().ref('siswa/' + data.key).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 alamatzonasi: updtKordinat,
        //     //                                 // idDesa: updtDesa,
        //     //                                 // idKecamatan: updtKecamatan,
        //     //                                 // namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 // sekolahZonasi: $scope.sklhNama1,
        //     //                                 // idsekolah_zonasi: $scope.sklhId1,
        //     //                                 // sekolahZonasiAlamat: $scope.sklhAlamat1
        //     //                             }).then(function () {
        //     //                                 console.log('EDIT /SISWA');
        //     //                                 firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                     alamat: updtAlamat,
        //     //                                     // nama: updtNama,
        //     //                                     // tempat_lahir: updtTmptLahir,
        //     //                                     kordinatzonasi: updtKordinat,
        //     //                                     // idDesa: updtDesa,
        //     //                                     // idKecamatan: updtKecamatan,
        //     //                                     // namaDesa: $scope.namaDesa,
        //     //                                     // namaKecamatan: $scope.namaKecamatan,
        //     //                                     // sekolah_zonasi: $scope.sklhNama1,
        //     //                                     // idsekolah_zonasi: $scope.sklhId1,
        //     //                                     // alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                     chekKordinat: updtValidasi,

        //     //                                 }).then(function () {
        //     //                                     $("#modal_edit").modal('hide');
        //     //                                     Swal.fire({
        //     //                                         icon: 'success',
        //     //                                         title: 'Success',
        //     //                                         text: 'Data Berhasil di update',
        //     //                                     })


        //     //                                     $scope.form.idKecamatan = undefined;
        //     //                                     $scope.form.idDesa = undefined;
        //     //                                 })
        //     //                             })
        //     //                         })

        //     //                     } else {
        //     //                         $ionicLoading.hide()
        //     //                         if ($scope.sklhNama1 != undefined && $scope.sklhId1 != undefined) {
        //     //                             console.log('EDI1');
        //     //                             console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //                             firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 kordinatzonasi: updtKordinat,
        //     //                                 // idDesa: updtDesa,
        //     //                                 // idKecamatan: updtKecamatan,
        //     //                                 // namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 // sekolah_zonasi: $scope.sklhNama1,
        //     //                                 // idsekolah_zonasi: $scope.sklhId1,
        //     //                                 // alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                 chekKordinat: updtValidasi,
        //     //                             }).then(function () {
        //     //                                 $("#modal_edit").modal('hide');
        //     //                                 Swal.fire({
        //     //                                     icon: 'success',
        //     //                                     title: 'Success',
        //     //                                     text: 'Data Berhasil di update',
        //     //                                 })


        //     //                                 $scope.form.idKecamatan = undefined;
        //     //                                 $scope.form.idDesa = undefined;
        //     //                             });
        //     //                         } else {
        //     //                             // $("#modal_edit").modal('hide');
        //     //                             // Swal.fire({
        //     //                             //     icon: 'warning',
        //     //                             //     title: 'Perhatian',
        //     //                             //     text: 'Sekolah Tujuan Tidak ditemukan kode 3',
        //     //                             // })
        //     //                             console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //                             firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 kordinatzonasi: updtKordinat,
        //     //                                 // idDesa: updtDesa,
        //     //                                 // idKecamatan: updtKecamatan,
        //     //                                 // namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 // sekolah_zonasi: $scope.sklhNama1,
        //     //                                 // idsekolah_zonasi: $scope.sklhId1,
        //     //                                 // alamatsekolahzonasi: $scope.sklhAlamat1,
        //     //                                 chekKordinat: updtValidasi,
        //     //                             }).then(function () {
        //     //                                 $("#modal_edit").modal('hide');
        //     //                                 Swal.fire({
        //     //                                     icon: 'success',
        //     //                                     title: 'Success',
        //     //                                     text: 'Data Berhasil di update',
        //     //                                 })


        //     //                                 $scope.form.idKecamatan = undefined;
        //     //                                 $scope.form.idDesa = undefined;
        //     //                             });

        //     //                         }
        //     //                         // location.reload();
        //     //                     }
        //     //                 })
        //     //                 // @@@@@
        //     //             } else {
        //     //                 // @@@@@
        //     //                 firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
        //     //                     // console.log(snapshot.val());
        //     //                     $ionicLoading.show()
        //     //                     if (snapshot.val() != null) {
        //     //                         snapshot.forEach(function (data) {
        //     //                             console.log(data.key);
        //     //                             $ionicLoading.hide()
        //     //                             firebase.database().ref('siswa/' + data.key).update({
        //     //                                 alamat: updtAlamat,
        //     //                                 // nama: updtNama,
        //     //                                 // tempat_lahir: updtTmptLahir,
        //     //                                 alamatzonasi: updtKordinat,
        //     //                                 // idDesa: updtDesa,
        //     //                                 // idKecamatan: updtKecamatan,
        //     //                                 chekKordinat: updtValidasi,
        //     //                                 // namaDesa: $scope.namaDesa,
        //     //                                 // namaKecamatan: $scope.namaKecamatan,
        //     //                                 // sekolahZonasi: $scope.sklhNama1,
        //     //                                 // idsekolah_zonasi: $scope.sklhId1,
        //     //                                 // sekolahZonasiAlamat: $scope.sklhAlamat1
        //     //                             }).then(function () {
        //     //                                 console.log('EDIT /SISWA');
        //     //                                 firebase.database().ref('datasiswa/' + updateID).update({
        //     //                                     alamat: updtAlamat,
        //     //                                     // nama: updtNama,
        //     //                                     // tempat_lahir: updtTmptLahir,
        //     //                                     kordinatzonasi: updtKordinat,
        //     //                                     // idDesa: updtDesa,
        //     //                                     // idKecamatan: updtKecamatan,
        //     //                                     chekKordinat: updtValidasi,
        //     //                                     // chekKordinat: updtValidasi,
        //     //                                     // namaDesa: $scope.namaDesa,
        //     //                                     // namaKecamatan: $scope.namaKecamatan,
        //     //                                     // sekolah_zonasi: $scope.sklhNama1,
        //     //                                     // idsekolah_zonasi: $scope.sklhId1,
        //     //                                     // alamatsekolahzonasi: $scope.sklhAlamat1

        //     //                                 }).then(function () {
        //     //                                     $("#modal_edit").modal('hide');
        //     //                                     Swal.fire({
        //     //                                         icon: 'success',
        //     //                                         title: 'Success',
        //     //                                         text: 'Data Berhasil di update',
        //     //                                     })


        //     //                                     $scope.form.idKecamatan = undefined;
        //     //                                     $scope.form.idDesa = undefined;
        //     //                                 })
        //     //                             })
        //     //                         })

        //     //                     } else {
        //     //                         $ionicLoading.hide()
        //     //                         console.log('EDI1');
        //     //                         console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //                         firebase.database().ref('datasiswa/' + updateID).update({
        //     //                             alamat: updtAlamat,
        //     //                             // nama: updtNama,
        //     //                             // tempat_lahir: updtTmptLahir,
        //     //                             kordinatzonasi: updtKordinat,
        //     //                             // idDesa: updtDesa,
        //     //                             // idKecamatan: updtKecamatan,
        //     //                             chekKordinat: updtValidasi,
        //     //                             // namaDesa: $scope.namaDesa,
        //     //                             // namaKecamatan: $scope.namaKecamatan,
        //     //                             // sekolah_zonasi: $scope.sklhNama1,
        //     //                             // idsekolah_zonasi: $scope.sklhId1,
        //     //                             // alamatsekolahzonasi: $scope.sklhAlamat1
        //     //                         }).then(function () {
        //     //                             $("#modal_edit").modal('hide');
        //     //                             Swal.fire({
        //     //                                 icon: 'success',
        //     //                                 title: 'Success',
        //     //                                 text: 'Data Berhasil di update',
        //     //                             })


        //     //                             $scope.form.idKecamatan = undefined;
        //     //                             $scope.form.idDesa = undefined;
        //     //                         });
        //     //                         // location.reload();
        //     //                     }
        //     //                 })
        //     //                 // @@@@@
        //     //             }
        //     //             // $("#modal_edit").modal('hide');
        //     //             // Swal.fire({
        //     //             //     icon: 'warning',
        //     //             //     title: 'Perhatian',
        //     //             //     text: 'Ada Edit Data alamat, Data Berubah',
        //     //             // })

        //     //             // @@@@@
        //     //             // firebase.database().ref('siswa').orderByChild('nisn').equalTo(updateID).on("value", function (snapshot) {
        //     //             //     // console.log(snapshot.val());
        //     //             //     $ionicLoading.show()
        //     //             //     if (snapshot.val() != null) {
        //     //             //         snapshot.forEach(function (data) {
        //     //             //             console.log(data.key);
        //     //             //             $ionicLoading.hide()
        //     //             //             firebase.database().ref('siswa/' + data.key).update({
        //     //             //                 alamat: updtAlamat,
        //     //             //                 nama: updtNama,
        //     //             //                 tempat_lahir: updtTmptLahir,
        //     //             //                 alamatzonasi: updtKordinat,
        //     //             //                 idDesa: updtDesa,
        //     //             //                 idKecamatan: updtKecamatan,
        //     //             //                 // namaDesa: $scope.namaDesa,
        //     //             //                 // namaKecamatan: $scope.namaKecamatan,
        //     //             //                 sekolah_zonasi: $scope.sklhNama1,
        //     //             //                 idsekolah_zonasi: $scope.sklhId1,
        //     //             //                 alamatsekolahzonasi: $scope.sklhAlamat1
        //     //             //             }).then(function () {
        //     //             //                 console.log('EDIT /SISWA');
        //     //             //                 firebase.database().ref('datasiswa/' + updateID).update({
        //     //             //                     alamat: updtAlamat,
        //     //             //                     nama: updtNama,
        //     //             //                     tempat_lahir: updtTmptLahir,
        //     //             //                     kordinatzonasi: updtKordinat,
        //     //             //                     idDesa: updtDesa,
        //     //             //                     idKecamatan: updtKecamatan,
        //     //             //                     // namaDesa: $scope.namaDesa,
        //     //             //                     // namaKecamatan: $scope.namaKecamatan,
        //     //             //                     sekolah_zonasi: $scope.sklhNama1,
        //     //             //                     idsekolah_zonasi: $scope.sklhId1,
        //     //             //                     alamatsekolahzonasi: $scope.sklhAlamat1

        //     //             //                 });
        //     //             //             })
        //     //             //         })

        //     //             //     } else {
        //     //             //         // if ($scope.sklhNama1 != undefined && $scope.sklhId1 != undefined) {
        //     //             //         //     console.log('EDI1');
        //     //             //         //     console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //             //         //     firebase.database().ref('datasiswa/' + updateID).update({
        //     //             //         //         alamat: updtAlamat,
        //     //             //         //         nama: updtNama,
        //     //             //         //         tempat_lahir: updtTmptLahir,
        //     //             //         //         kordinatzonasi: updtKordinat,
        //     //             //         //         idDesa: updtDesa,
        //     //             //         //         idKecamatan: updtKecamatan,
        //     //             //         //         // namaDesa: $scope.namaDesa,
        //     //             //         //         // namaKecamatan: $scope.namaKecamatan,
        //     //             //         //         sekolah_zonasi: $scope.sklhNama1,
        //     //             //         //         idsekolah_zonasi: $scope.sklhId1,
        //     //             //         //         alamatsekolahzonasi: $scope.sklhAlamat1


        //     //             //         //     });
        //     //             //         // } else {
        //     //             //         //     console.log('EDIT2');
        //     //             //         //     console.log(updtDesa, updtKordinat, updtKecamatan, updtDesa, $scope.namaDesa, $scope.namaKecamatan);
        //     //             //         //     firebase.database().ref('datasiswa/' + updateID).update({
        //     //             //         //         alamat: updtAlamat,
        //     //             //         //         nama: updtNama,
        //     //             //         //         tempat_lahir: updtTmptLahir,
        //     //             //         //         kordinatzonasi: updtKordinat,
        //     //             //         //         idDesa: updtDesa,
        //     //             //         //         idKecamatan: updtKecamatan,
        //     //             //         //         // namaDesa: $scope.namaDesa,
        //     //             //         //         // namaKecamatan: $scope.namaKecamatan,
        //     //             //         //         // sekolah_zonasi: $scope.sklhNama1,
        //     //             //         //         // idsekolah_zonasi: $scope.sklhId1


        //     //             //         //     });

        //     //             //         // }
        //     //             //         // location.reload();
        //     //             //     }
        //     //             // })

        //     //             // @@@@@
        //     //             // $ionicLoading.hide()
        //     //             // $("#modal_edit").modal('hide');
        //     //             // Swal.fire({
        //     //             //     icon: 'success',
        //     //             //     title: 'Sukses',
        //     //             //     text: 'Data Berhasil Diperbaharui',
        //     //             // })

        //     //         }

        //     //     } else {
        //     //         $("#modal_edit").modal('hide');
        //     //         Swal.fire({
        //     //             icon: 'warning',
        //     //             title: 'Perhatian',
        //     //             text: 'Edit Kolom Desa atau Kecamatan yang masih kosong',
        //     //         })
        //     //     }

        //     // } else {
        //     //     $("#modal_edit").modal('hide');
        //     //     Swal.fire({
        //     //         icon: 'warning',
        //     //         title: 'Perhatian',
        //     //         text: 'Data Belum Lengkap',
        //     //     })
        //     // }

        //     var updtnama = document.getElementById("namaEdit").value;
        //     var updtAlamat = document.getElementById("alamatEdit").value;
        //     var updtDesa = document.getElementById("DesaEdit").value;
        //     var updtValidasi = document.getElementById("ValidasiEdit").value;
        //     console.log(updtValidasi);
        //     var updateValidasiFix;
        //     if (updtValidasi == "true") {
        //         updateValidasiFix = true;
        //         console.log(updateValidasiFix);
        //     } else {
        //         updateValidasiFix = false;
        //         console.log(updateValidasiFix);
        //     }

        //     firebase.database().ref('datasiswa/' + updateID).update({
        //         chekKordinat: updateValidasiFix,
        //         alamat: updtAlamat,

        //     });
        //     $("#modal_edit").modal('hide');
        //     Swal.fire({
        //         icon: 'success',
        //         title: 'Sukses',
        //         text: 'Data Berhasil Diperbaharui',
        //     })
        // }

        $scope.simpanEditSiswaAdmin = function () {
            var updtValidasi = document.getElementById("ValidasiEdit").value;
            var updtKordinat = document.getElementById("kordinatEdit").value;
            console.log(updtValidasi);
            var updateValidasiFix;
            if (updtValidasi == "true") {
                updateValidasiFix = true;
                console.log(updateValidasiFix);
            } else {
                updateValidasiFix = false;
                console.log(updateValidasiFix);
            }

            firebase.database().ref('datasiswa/' + updateID).update({
                chekKordinat: updateValidasiFix,
                kordinatzonasi: updtKordinat,

            });
            $("#modal_edit").modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Sukses',
                text: 'Data Berhasil Diperbaharui',
            })
        }

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
                html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Siswa </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.database().ref('datasiswa/' + id).remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Dihapus',
                    })
                }
            })
        });
    }])

    .controller('dataSiswaBelumDaftarCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


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

        $ionicLoading.show();

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

        var ref = firebase.database().ref("datasiswa_belumdaftar");
        var listRef = $firebaseArray(ref);

        listRef.$loaded().then(function (response) {
            console.log(response);
            $scope.siswa = response;
            $scope.jumlah_siswa = response.length;

        })


        $ionicLoading.hide();

        $scope.form = {
            "jenjang": "SMP",
            "status": "",
            "namaSekolah": "",
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
            "alamatSekolah": "",
            "npsn": "",
            "idDesa": "",
        }

        var refKecamatan = firebase.database().ref("kecamatan");
        $scope.dataKecamatan = $firebaseArray(refKecamatan);
        // console.log($scope.dataKecamatan);

        var refSekolah = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo('SD');;
        $scope.dataSekolah = $firebaseArray(refSekolah);

        $scope.getIdKecamatan = function () {
            var idKecamatan = $scope.form.idKecamatan;
            $scope.idKecamatan = $scope.form.idKecamatan;
            //Get Nama Kecamatan
            var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
            var listNamaKecamatan = $firebaseArray(namaKecamatan);
            listNamaKecamatan.$loaded().then(function (response) {
                $scope.namaKecamatan = response[0].nama_kecamatan;
                $scope.id_kecamatan = response[0].id_kecamatan;
                console.log($scope.id_kecamatan);

            });

            var refDesa = firebase.database().ref("desa").orderByChild("id_kecamatan").equalTo(idKecamatan);
            $scope.dataDesa = $firebaseArray(refDesa);
            // console.log($scope.dataKecamatan);
        }

        $scope.getIdDesa = function () {
            var idDesa = $scope.form.idDesa;
            $scope.idDesa = $scope.form.idDesa;
            //Get Nama Kecamatan
            var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
            var listNamaDesa = $firebaseArray(namaDesa);
            listNamaDesa.$loaded().then(function (response) {
                $scope.namaDesa = response[0].nama_desa;
                $scope.id_desa = response[0].id_desa;
                $scope.sklhNama = response[0].nama_smp;
                $scope.sklhId = response[0].id_smp;
                $scope.sklhAlamat = response[0].alamat_smp;
                console.log($scope.id_desa);
                console.log($scope.sklhId);

            });

            // var refBanjar = firebase.database().ref("banjar").orderByChild("id_desa").equalTo(idDesa);
            // $scope.dataBanjar = $firebaseArray(refBanjar);
        }
        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-siswa'));
            XLSX.writeFile(wb, "Data Siswa Belum Daftar" + ".xlsx");
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
                    $ionicLoading.hide();
                    // window.alert('Upload Sukses');
                    // $("#form-tambah-siswa-rayon").reset();
                    $("#modal_tambah").modal('hide');
                    $('.modal-backdrop').remove();
                    // $state.go("menuAdmin.dataSekolahAdmin")
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Ditambahkan',
                    })
                })

            }
            else {
                $ionicLoading.hide();
                // window.alert('Data Belum Lengkap');
                Swal.fire({
                    icon: 'success',
                    title: 'Sukses',
                    text: 'Data Belum Lengkap',
                })

            }
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

        // $scope.refresh = function () {
        //     console.log('JALAN')
        //     var ref = firebase.database().ref("siswa");
        //     var listRef = $firebaseArray(ref);

        //     listRef.$loaded().then(function (response) {
        //         console.log(response);
        //         for (let index = 0; index < response.length; index++) {
        //             response[index].nisn
        //             console.log(response[index].nisn)

        //              // HAPUS DATA DARI SISWA BELUM DAFTAR
        //              firebase.database().ref("datasiswa_belumdaftar/"+ response[index].nisn).remove();
        //         }
        //         // $scope.siswa= response;
        //         // $scope.jumlah_siswa = response.length;
        //         // firebase.database().ref('jumlah').update({
        //         //     jumlah_siswa : $scope.jumlah_siswa,
        //         // })

        //     })
        // }

        $scope.refresh = function () {
            console.log('JALAN')
            var ref = firebase.database().ref("datasiswa");
            var listRef = $firebaseArray(ref);
            listRef.$loaded().then(function (response) {
                console.log(response);
                for (let index = 0; index < response.length; index++) {
                    response[index].nisn
                    console.log(response[index].nisn)

                    firebase.database().ref('datasiswa_belumdaftar/' + response[index].nisn).update({
                        nisn: response[index].nisn,
                        nama: response[index].nama,
                        sekolah_asal: response[index].sekolah_asal,
                        sekolah_zonasi: response[index].sekolah_zonasi,
                    }).then(function () {
                        console.log('EDIT /SISWA');
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Data Berhasil di update',
                        })
                    })

                }
            })
        }


        //UPDATE
        var updateID = '';
        $('body').on('click', '.updateData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('datasiswa/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("namaEdit").value = values.nama;
                document.getElementById("nisnEdit").value = values.nisn;
                document.getElementById("nikEdit").value = values.nik;
                document.getElementById("sekolah_asalEdit").value = values.sekolah_asal;
                document.getElementById("npsnEdit").value = values.id_sd;
            });
        });

        $('.updateSiswa').on('click', function () {
            var updtnama = document.getElementById("namaEdit").value;
            var updtnisn = document.getElementById("nisnEdit").value;
            var updtnik = document.getElementById("nikEdit").value;
            var updtsekolah_asal = document.getElementById("sekolah_asalEdit").value;
            var updtnpsn = document.getElementById("npsnEdit").value;

            var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
            if (updtnama.length > 0 && updtnisn.length > 0 && updtnik.length > 0 && updtsekolah_asal.length > 0 && updtnpsn.length > 0) {

                var postData = {};
                postData = {
                    nama: updtnama,
                    nisn: updtnisn,
                    nik: updtnik,
                    sekolah_asal: updtsekolah_asal,
                    nisn: updtnpsn,
                    editAt: createAt,
                };

                var updates = {};
                updates['/datasiswa/' + updateID] = postData;

                firebase.database().ref().update(updates);
                // window.alert("Data Siswa Berhasil Diperbaharui");
                $("#modal_edit").modal('hide');
                $('.modal-backdrop').remove();
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
                html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Siswa </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.database().ref('datasiswa/' + id).remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Dihapus',
                    })
                }
            })
        });
    }])

    .controller('dataSiswaPenyaluranCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {


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

        $ionicLoading.show();

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

        var ref = firebase.database().ref("siswaTidakloloszona");
        var listRef = $firebaseArray(ref);

        listRef.$loaded().then(function (response) {
            console.log(response);
            $scope.siswa = response;
            $scope.jumlah_siswa = response.length;

        })


        $ionicLoading.hide();

        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-siswa'));
            XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
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


        //UPDATE
        var updateID = '';
        $('body').on('click', '.updateData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("nisnVerifZonasi").value = values.nisn;
                document.getElementById("nikVerifZonasi").value = values.nik;
                document.getElementById("namaVerifZonasi").value = values.nama;
                document.getElementById("alamatsiswaVerifZonasi").value = values.sekolahZonasiId;
                document.getElementById("alamatVerifZonasi").value = values.alamatzonasi;
                document.getElementById("sekolahVerifZonasi").value = values.sekolah_asal;
                document.getElementById("tglLahirVerifZonasi").value = values.sekolahZonasi;
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

            });
        });


        // $scope.form = {
        //     "idSekolahPenyaluran": '',
        // }
        var refSekolah = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo('SMP');;
        $scope.dataSekolah = $firebaseArray(refSekolah);

        $scope.getIdSekolah = function () {
            console.log($scope.idSekolahPenyaluran)
        }



        //SALURKAN
        var updateID = '';
        $('body').on('click', '.updateDataSalurkan', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref("siswa/" + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("nisnSalurkan").value = values.nisn;
                document.getElementById("namaSalurkan").value = values.nama;
                document.getElementById("sekolahSalurkan").value = values.sekolah_asal;

                console.log(values.uid);
                $scope.salurkan = function () {
                    var nama = values.nama;
                    var sekolah = $scope.idSekolahPenyaluran;
                    var smppenyaluran = document.getElementById("SMPSalurkan").value
                    // console.log(nama);
                    // console.log(smppenyaluran);
                    var dbRef = firebase.database();
                    var pengguna = dbRef.ref('sekolah');
                    pengguna.orderByChild('npsn').equalTo(smppenyaluran).on("value", function (snapshot) {
                        console.log(snapshot.val());
                        if (snapshot.val() != null) {
                            console.log('SALURKAN');
                            console.log(nama);
                            console.log(smppenyaluran);
                            snapshot.forEach(function (data) {
                                // console.log(data.key);
                                let firebaseRefKey = firebase.database().ref('sekolah').child(data.key);
                                firebaseRefKey.on('value', (dataSnapShot) => {
                                    $scope.formnamaSekolah = dataSnapShot.val().sekolah
                                })
                            });

                            console.log($scope.formnamaSekolah);
                            firebase.database().ref('siswa/' + values.uid).update({
                                status_terimaPenyaluran: true,
                                sekolahPenyaluranId: smppenyaluran,
                                sekolahPenyaluran: $scope.formnamaSekolah,
                                nomor_penyaluran: 'penyalurandisdik/' + smppenyaluran + '/' + values.nisn
                            }).then(function (response) {
                                firebase.database().ref('smp/' + smppenyaluran + '/penyaluran/' + values.uid).update({
                                    status_terimaPenyaluran: true,
                                    nama: nama,
                                    nisn: values.nisn,
                                    sekolah_asal: values.sekolah_asal,
                                    darismp: values.sekolahZonasi,
                                }).then(function (response) {
                                    firebase.database().ref('siswaTidakloloszona/' + values.uid).update({
                                        status_terimaPenyaluran: true,
                                        kesmpId: smppenyaluran,
                                        sekolahPenyaluranId: smppenyaluran,
                                        sekolahPenyaluran: $scope.formnamaSekolah,
                                        nomor_penyaluran: 'penyalurandisdik/' + smppenyaluran + '/' + values.nisn
                                    }).then(function (response) {
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Sukses',
                                            text: 'Data Siswa Berhasil di Update',
                                        })
                                        $("#modal_salurkan").modal('hide')
                                    })
                                })


                            })

                        } else {
                            $("#modal_salurkan").modal('hide')
                            Swal.fire({
                                icon: 'warning',
                                title: 'Perhatian',
                                text: 'NPSN SMP TIDAK DITEMUKAN',
                                focusConfirm: false
                            })
                        }

                    })

                }


            });


        });

    }])

    .controller('dataSiswaLuarRayonCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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

        $ionicLoading.show();

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

        var ref = firebase.database().ref("datasiswaverif");
        var listRef = $firebaseArray(ref);

        listRef.$loaded().then(function (response) {
            console.log(response);
            $scope.siswa = response;
            $scope.jumlah_siswa = response.length;
            firebase.database().ref('jumlah').update({
                jumlah_siswaLuarRayon: $scope.jumlah_siswa,
            })

        })


        $ionicLoading.hide();

        $scope.form = {
            "jenjang": "SMP",
            "status": "",
            "namaSekolah": "",
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
            "alamatSekolah": "",
            "npsn": "",
            "idDesa": "",
        }
        var refDesa = firebase.database().ref("desa");
        $scope.dataDesa = $firebaseArray(refDesa);
        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-siswa'));
            XLSX.writeFile(wb, "Data Siswa" + ".xlsx");
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

        //UPDATE
        var updateID = '';
        $('body').on('click', '.updateData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('datasiswaverif/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("nisnEdit").value = values.nisn;
                document.getElementById("nikEdit").value = values.nik;
                document.getElementById("namaEdit").value = values.nama;
                document.getElementById("tglLahirEdit").value = values.tanggal_lahir;
                document.getElementById("tempatLahirEdit").value = values.tempat_lahir;
                document.getElementById("alamatEdit").value = values.alamat;
                document.getElementById("KecamatanEdit").value = values.namaKecamatan;
                document.getElementById("DesaEdit").value = values.namaDesa;
                document.getElementById("BanjarEdit").value = values.namaBanjar;
                document.getElementById("ValidasiEdit").value = values.status_verif;
                // $scope.idKecamatanEdit = values.idKecamatan;
                // $scope.idDesaEdit = values.idDesa;
                console.log(values.status_verif);
                if (values.kordinatzonasi == undefined) {
                    document.getElementById("kordinatEdit").value = '0,0';
                } else {
                    document.getElementById("kordinatEdit").value = values.kordinatzonasi;
                }


                $scope.nisnPush = values.nisn;
                $scope.namaPush = values.nama;
                $scope.nikPush = values.nik;
                $scope.tanggal_lahirPush = values.tanggal_lahir;
                $scope.tempat_lahirPush = values.tempat_lahir;
                $scope.alamatPush = values.alamat;
                $scope.namaKecamatanPush = values.namaKecamatan;
                $scope.idKecamatanPush = values.idKecamatan;
                $scope.namaDesaPush = values.namaDesa;
                $scope.idDesaPush = values.idDesa;
                $scope.namaBanjarPush = values.namaBanjar;
                $scope.idBanjarPush = values.idBanjar;

                $scope.id_sdpush = values.id_sd;
                $scope.idsekolah_zonasipush = values.idsekolah_zonasi;
                $scope.sekolah_zonasipush = values.sekolah_zonasi;
                $scope.Alamatsekolah_zonasipush = values.alamatsekolahzonasi;                ;
                $scope.jenis_kelaminpush = values.jenis_kelamin;
                $scope.kordinatzonasipush = values.kordinatzonasi;

                $scope.sekolah_asalpush = values.sekolah_asal

                console.log('SZPUSH: ' + $scope.idsekolah_zonasipush)
            });

            firebase.database().ref('datasiswaverif/' + updateID + '/fileDok').on('value', function (snapshot) {
                var data = snapshot.val();
                var url = data.URL
                // console.log(url);

                $scope.lihatFileSK = function () {
                    window.open(url);
                }

            })
        });

        // SIMPAN HASIL EDIT

        $scope.simpanEditSiswaAdmin = function () {
            var updtValidasi = document.getElementById("ValidasiEdit").value;
            $scope.kordinatzonasipush = document.getElementById("kordinatEdit").value;
            console.log(updtValidasi);
            var updateValidasiFix;
            if (updtValidasi == "true") {
                updateValidasiFix = true;
                console.log(updateValidasiFix);
                firebase.database().ref('datasiswa/' + updateID).update({
                    alamat: $scope.alamatPush,
                    alamatsekolahzonasi: $scope.Alamatsekolah_zonasipush,
                    chekKordinat: true,
                    idBanjar: $scope.idBanjarPush,
                    idDesa: $scope.idDesaPush,
                    idKecamatan: $scope.idKecamatanPush,
                    id_sd: $scope.id_sdpush,
                    id_smp_pilihan: "-",
                    idsekolah_zonasi: $scope.idsekolah_zonasipush,
                    jenis_kelamin: $scope.jenis_kelaminpush,
                    kordinatzonasi: $scope.kordinatzonasipush,
                    namaBanjar: $scope.namaBanjarPush,
                    namaDesa: $scope.namaDesaPush,
                    namaKecamatan: $scope.namaKecamatanPush,
                    nama: $scope.namaPush,
                    nik: $scope.nikPush,
                    nisn: $scope.nisnPush,
                    sekolah_asal: $scope.sekolah_asalpush,
                    sekolah_zonasi: $scope.sekolah_zonasipush,
                    tanggal_lahir: $scope.tanggal_lahirPush,
                    tempat_lahir: $scope.tempat_lahirPush,
                    umur: "4483",
                    umur_display: "12 tahun 3 bulan 8 hari",
                });
            } else {
                updateValidasiFix = false;
                console.log(updateValidasiFix);
                firebase.database().ref('datasiswa/' + updateID).remove();
            }
            firebase.database().ref('datasiswaverif/' + updateID).update({
                status_verif: updateValidasiFix,
                kordinatzonasi: $scope.kordinatzonasipush,
            });
            $("#modal_edit").modal('hide');
            Swal.fire({
                icon: 'success',
                title: 'Sukses',
                text: 'Data Berhasil Diperbaharui',
            })
        }

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
                title: 'Perhatian Hapus',
                icon: 'error',
                html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Siswa </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
                reverseButtons: true
            }).then((result) => {

                if (result.isConfirmed) {
                    console.log(result);
                    firebase.database().ref('datasiswaverif/' + id).remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Dihapus',
                    })
                } else {
                    $("#modal_hapus").modal('hide');
                }
            })
        });
    }])