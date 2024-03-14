angular.module('app.dataSekolah', [])

    .controller('dataSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
            if($("#nightmode").hasClass("night-active")){
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
            }else{
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
        

        if(window.localStorage.nightActive == 'on'){
            $('#nightmode').addClass("night-active");

        }else{
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

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_smp = response.length;
        })

        var ref2 = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SD");
        var listRef2 = $firebaseArray(ref2);

        $ionicLoading.show();
        listRef2.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.jumlah_sd = response.length;
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

        $scope.lihat_smp = function () {
            $state.go('dataSekolahSmp');
        }

        $scope.lihat_sd = function () {
            $state.go('dataSekolahSd');
        }

        $scope.data_pendaftar = function () {
            $state.go('dataPendaftarAdminSuperMenu');
        }

    }])

    .controller('dataSekolahSmpCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
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
            if($("#nightmode").hasClass("night-active")){
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
            }else{
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
        

        if(window.localStorage.nightActive == 'on'){
            $('#nightmode').addClass("night-active");

        }else{
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

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SMP");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.sekolah_smp = response;
        })

        $scope.form = {
            "jenjang": "SMP",
            "status": "",
            "namaSekolah": "",
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
            "alamatSekolah": "",
            "npsn": "",
        }

        var idProvinsi = $scope.form.idProvinsi;
        console.log(idProvinsi)

        //Get Nama Provinsi
        var namaProvinsi = firebase.database().ref("provinsi").orderByChild("id_provinsi").equalTo(idProvinsi);
        var listNamaProvinsi = $firebaseArray(namaProvinsi);
        listNamaProvinsi.$loaded().then(function (response) {
            $scope.namaProvinsi = response[0].nama_provinsi;
            // console.log($scope.namaProvinsi);
        });

        var idKotaKabupaten = $scope.form.idKotaKabupaten;
        console.log(idKotaKabupaten)
        //Get Nama Kota Kabupaten
        var namaKotaKabupaten = firebase.database().ref("kota").orderByChild("id_kota_kabupaten").equalTo(idKotaKabupaten);
        var listNamaKotaKabupaten = $firebaseArray(namaKotaKabupaten);
        listNamaKotaKabupaten.$loaded().then(function (response) {
            $scope.namaKotaKabupaten = response[0].nama_kota_kabupaten;
            console.log($scope.namaKotaKabupaten);
        });

        var refKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kota_kabupaten").equalTo(idKotaKabupaten);
        $scope.dataKecamatan = $firebaseArray(refKecamatan);
        console.log($scope.dataKecamatan);

        $scope.getIdKecamatan = function () {
            var idKecamatan = $scope.form.idKecamatan;
            $scope.idKecamatan = $scope.form.idKecamatan;
            //Get Nama Kecamatan
            var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
            var listNamaKecamatan = $firebaseArray(namaKecamatan);
            listNamaKecamatan.$loaded().then(function (response) {
                $scope.namaKecamatan = response[0].nama_kecamatan;
                $scope.id_kecamatan = response[0].id_kecamatan;
                // console.log($scope.id_kecamatan);

            });
        }
        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-sekolah-smp'));
            XLSX.writeFile(wb, "Data Sekolah SMP" + ".xlsx");
        }

        $scope.simpan = function () {
            var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
            if ($scope.form.jenjang !== "" && $scope.form.status !== "" && $scope.form.namaSekolah !== "" && $scope.form.idProvinsi !== "" && $scope.form.idKotaKabupaten !== "" && $scope.form.idKecamatan !== "" && $scope.form.npsn !== "") {
                $ionicLoading.show();
                var ref = firebase.database().ref("sekolah").child($scope.form.npsn);
                ref.set({
                    // "id_kecamatan": $scope.form.idKecamatan,
                    // "id_kota_kabupaten": $scope.form.idKotaKabupaten,
                    // "id_provinsi": $scope.form.idProvinsi,
                    // "jenjang": $scope.form.jenjang,
                    // "nama_kecamatan": $scope.namaKecamatan,
                    // "nama_kota_kabupaten": $scope.namaKotaKabupaten,
                    // "nama_provinsi": $scope.namaProvinsi,
                    // "sekolah": $scope.form.namaSekolah,
                    // "npsn": $scope.form.npsn,
                    // "status": $scope.form.status,
                    // "alamat_sekolah": $scope.form.alamatSekolah,
                    // "filter": $scope.form.idKecamatan + "_" + $scope.form.jenjang,
                    // "createAt": createAt,
                    // "diBuatOleh": $scope.namaAdmin,
                    // "idPembuat": $scope.idAdmin,
                    "createAt": createAt,
                    // "emailAdmin": "smptriamertasingaraja@eppdb.buleleng"
                    "filter": $scope.form.jenjang+ "-" +$scope.form.idKecamatan+ "-" +$scope.form.status,
                    "id_kecamatan": $scope.form.idKecamatan,
                    "id_sekolah": $scope.form.npsn,
                    "jenjang": $scope.form.jenjang,
                    "kuota": 0,
                    "kuota_afirmasi": "",
                    "kuota_perpindahan": "",
                    "kuota_prestasi": "",
                    "kuota_zonasi": "",
                    "npsn": $scope.form.npsn,
                    "penyaluran": 0,
                    "persentase_afirmasi": "",
                    "persentase_perpindahan": "",
                    "persentase_prestasi": "",
                    "persentase_zonasi": "",
                    "sekolah": $scope.form.namaSekolah,
                    "status": $scope.form.status,


                }).then(function (resp) {
                    $ionicLoading.hide();
                    // window.alert('Upload Sukses');
                    // $scope.form.namaSekolah.reset();
                    $("#modal_tambah_sekolah").modal('hide');
                    $('.modal-backdrop').remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Ditambahkan',
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

        //UPDATE
        var updateID = '';
        $('body').on('click', '.updateData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('sekolah/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("jenjangEdit").value = values.jenjang;
                document.getElementById("statusEdit").value = values.status;
                document.getElementById("sekolahEdit").value = values.sekolah;
                document.getElementById("kecamatanEdit").value = values.id_kecamatan;
                document.getElementById("npsnEdit").value = values.npsn;
                document.getElementById("KuotaEdit").value = values.kuota;

                console.log(values.kuota_zonasi);
                
                if (values.penyaluran != undefined) {
                    document.getElementById("PenyaluranEdit").value = values.penyaluran;
                } else {
                    document.getElementById("PenyaluranEdit").value = 0;
                } 
                if (values.penyaluranAfirmasi != undefined) {
                    document.getElementById("PenyaluranAfirmasiEdit").value = values.penyaluranAfirmasi;
                } else {
                    document.getElementById("PenyaluranAfirmasiEdit").value = 0;
                }
                if (values.penyaluranPrestasi != undefined) {
                    document.getElementById("PenyaluranPrestasiEdit").value = values.penyaluranPrestasi;
                } else {
                    document.getElementById("PenyaluranPrestasiEdit").value = 0;
                } 
                if (values.penyaluranPerpindahan != undefined) {
                    document.getElementById("PenyaluranPerpindahanEdit").value = values.penyaluranPerpindahan;
                } else {
                    document.getElementById("PenyaluranPerpindahanEdit").value = 0;
                } 

                
                console.log(values.aksesEditRanking);
                if (values.aksesEditRanking == undefined) {
                    document.getElementById("aksesEditRanking").value = '';
                } else {
                    document.getElementById("aksesEditRanking").value = values.aksesEditRanking;
                }
            });
        });

         //UPDATE
         var updateID = '';
         $('body').on('click', '.updateData', function () {
             updateID = $(this).attr('data-id');
             // window.alert(updateID);
             firebase.database().ref('sekolah/' + updateID).on('value', function (snapshot) {
                 var values = snapshot.val();
                 document.getElementById("jenjangEdit").value = values.jenjang;
                 document.getElementById("statusEdit").value = values.status;
                 document.getElementById("sekolahEdit").value = values.sekolah;
                 document.getElementById("kecamatanEdit").value = values.id_kecamatan;
                 document.getElementById("npsnEdit").value = values.npsn;
 
             });
         });
 
 
         $scope.simpanEditSekolah = function () {
 
             var updtJenjang = document.getElementById("jenjangEdit").value;
             var updtStatus = document.getElementById("statusEdit").value;
             var updtSekolah = document.getElementById("sekolahEdit").value;
             var updtKecamatan = document.getElementById("kecamatanEdit").value;
             var updtNpsn = document.getElementById("npsnEdit").value;
             var updtKuota = document.getElementById("KuotaEdit").value;
             var updtPenyaluran = document.getElementById("PenyaluranEdit").value;
             var updtPenyaluranAfirmasi = document.getElementById("PenyaluranAfirmasiEdit").value;
             var updtPenyaluranPrestasi = document.getElementById("PenyaluranPrestasiEdit").value;
             var updtPenyaluranPerpindahan = document.getElementById("PenyaluranPerpindahanEdit").value;

             var updtaksesEditRanking = document.getElementById("aksesEditRanking").value;
             var updtaksesEditRankingFix;
             console.log(updtaksesEditRanking);
             if (updtaksesEditRanking == "true") {
                updtaksesEditRankingFix = true;
             } else {
                updtaksesEditRankingFix = false;
             }
 
 
             var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
             if (updtJenjang.length > 0 && updtStatus.length > 0 && updtSekolah.length > 0 && updtKecamatan.length > 0 && updtNpsn.length > 0) {
 
                 firebase.database().ref('sekolah/' + updateID).update({
                     jenjang: updtJenjang,
                     sekolah: updtSekolah,
                     npsn: updtNpsn,
                     status: updtStatus,
                     createAt: createAt,
                     penyaluran: updtPenyaluran,
                     penyaluranAfirmasi: updtPenyaluranAfirmasi,
                     penyaluranPrestasi: updtPenyaluranPrestasi,
                     penyaluranPerpindahan: updtPenyaluranPerpindahan,
                     kuota:updtKuota,

                     aksesEditRanking : updtaksesEditRankingFix,


                 });
 
                //  window.alert("Data Sekolah Berhasil Diperbaharui");
                 $("#modal_edit").modal('hide');
                 $('.modal-backdrop').remove();
                Swal.fire({
                    icon: 'success',
                    title: 'Sukses',
                    text: 'Data Berhasil di Update',
                  })
 
             }
             else {
                //  window.alert("Data Belum Lengkap");
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Data Belum Lengkap',
                  })
             }
 
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
                html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Sekolah </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.database().ref('sekolah/' + id).remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Dihapus',
                    })
                }
            })
        });
    }])

    .controller('dataSekolahSdCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
            if($("#nightmode").hasClass("night-active")){
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
            }else{
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
        

        if(window.localStorage.nightActive == 'on'){
            $('#nightmode').addClass("night-active");

        }else{
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

        var ref = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo("SD");
        var listRef = $firebaseArray(ref);

        $ionicLoading.show();
        listRef.$loaded().then(function (response) {
            $ionicLoading.hide();
            console.log(response);
            $scope.sekolah_sd = response;
        })

        $scope.form = {
            "jenjang": "SD",
            "status": "",
            "namaSekolah": "",
            "idProvinsi": "id-bali",
            "idKotaKabupaten": "id-buleleng",
            "idKecamatan": "",
            "alamatSekolah": "",
            "npsn": "",
        }

        var idProvinsi = $scope.form.idProvinsi;
        console.log(idProvinsi)

        //Get Nama Provinsi
        var namaProvinsi = firebase.database().ref("provinsi").orderByChild("id_provinsi").equalTo(idProvinsi);
        var listNamaProvinsi = $firebaseArray(namaProvinsi);
        listNamaProvinsi.$loaded().then(function (response) {
            $scope.namaProvinsi = response[0].nama_provinsi;
            // console.log($scope.namaProvinsi);
        });

        var idKotaKabupaten = $scope.form.idKotaKabupaten;
        console.log(idKotaKabupaten)
        //Get Nama Kota Kabupaten
        var namaKotaKabupaten = firebase.database().ref("kota").orderByChild("id_kota_kabupaten").equalTo(idKotaKabupaten);
        var listNamaKotaKabupaten = $firebaseArray(namaKotaKabupaten);
        listNamaKotaKabupaten.$loaded().then(function (response) {
            $scope.namaKotaKabupaten = response[0].nama_kota_kabupaten;
            console.log($scope.namaKotaKabupaten);
        });

        var refKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kota_kabupaten").equalTo(idKotaKabupaten);
        $scope.dataKecamatan = $firebaseArray(refKecamatan);
        console.log($scope.dataKecamatan);

        $scope.getIdKecamatan = function () {
            var idKecamatan = $scope.form.idKecamatan;
            $scope.idKecamatan = $scope.form.idKecamatan;
            //Get Nama Kecamatan
            var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
            var listNamaKecamatan = $firebaseArray(namaKecamatan);
            listNamaKecamatan.$loaded().then(function (response) {
                $scope.namaKecamatan = response[0].nama_kecamatan;
                $scope.id_kecamatan = response[0].id_kecamatan;
                // console.log($scope.id_kecamatan);

            });
        }
        $scope.cetak = function () {
            var wb = XLSX.utils.table_to_book(document.getElementById('tbl-data-sekolah-sd'));
            XLSX.writeFile(wb, "Data Sekolah SD" + ".xlsx");
        }
        $scope.simpan = function () {
            var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
            if ($scope.form.jenjang !== "" && $scope.form.status !== "" && $scope.form.namaSekolah !== "" && $scope.form.idProvinsi !== "" && $scope.form.idKotaKabupaten !== "" && $scope.form.idKecamatan !== "" && $scope.form.npsn !== "") {
                $ionicLoading.show();
                var ref = firebase.database().ref("sekolah").child($scope.form.npsn);
                ref.set({
                    "id_kecamatan": $scope.form.idKecamatan,
                    "id_kota_kabupaten": $scope.form.idKotaKabupaten,
                    "id_provinsi": $scope.form.idProvinsi,
                    "jenjang": $scope.form.jenjang,
                    "nama_kecamatan": $scope.namaKecamatan,
                    "nama_kota_kabupaten": $scope.namaKotaKabupaten,
                    "nama_provinsi": $scope.namaProvinsi,
                    "nama_sekolah": $scope.form.namaSekolah,
                    "npsn": $scope.form.npsn,
                    "status": $scope.form.status,
                    "alamat_sekolah": $scope.form.alamatSekolah,
                    "filter": $scope.form.idKecamatan + "_" + $scope.form.jenjang,
                    "createAt": createAt,
                    // "diBuatOleh": $scope.namaAdmin,
                    // "idPembuat": $scope.idAdmin,
                    "createAt": createAt,
                    // emailAdmin: "sdjendeladunia@eppdb.buleleng"
                    "filter": $scope.form.jenjang +"-"+ $scope.form.idKecamatan +"-"+ $scope.form.status,
                    "id_kecamatan": $scope.form.idKecamatan,
                    "id_sekolah": $scope.form.npsn,
                    "jenjang": $scope.form.jenjang,
                    "kuota": 0,
                    "kuota_afirmasi": "",
                    "kuota_perpindahan": "",
                    "kuota_prestasi": "",
                    "kuota_zonasi": "",
                    "npsn": $scope.form.npsn,
                    "persentase_afirmasi": "",
                    "persentase_perpindahan": "",
                    "persentase_prestasi": "",
                    "persentase_zonasi": "",
                    "sekolah": $scope.form.namaSekolah,
                    "status":  $scope.form.status,


                }).then(function (resp) {
                    $ionicLoading.hide();
                    // window.alert('Upload Sukses');
                    // $scope.form.namaSekolah.reset();
                    $("#modal_tambah_sekolahSD").modal('hide');
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
                    icon: 'warning',
                    title: 'Perhatian',
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

        //UPDATE
        var updateID = '';
        $('body').on('click', '.updateData', function () {
            updateID = $(this).attr('data-id');
            // window.alert(updateID);
            firebase.database().ref('sekolah/' + updateID).on('value', function (snapshot) {
                var values = snapshot.val();
                document.getElementById("jenjangEdit").value = values.jenjang;
                document.getElementById("statusEdit").value = values.status;
                document.getElementById("sekolahEdit").value = values.sekolah;
                document.getElementById("kecamatanEdit").value = values.id_kecamatan;
                document.getElementById("npsnEdit").value = values.npsn;

            });
        });


        $scope.simpanEditSekolahSD = function () {

            var updtJenjang = document.getElementById("jenjangEdit").value;
            var updtStatus = document.getElementById("statusEdit").value;
            var updtSekolah = document.getElementById("sekolahEdit").value;
            var updtKecamatan = document.getElementById("kecamatanEdit").value;
            var updtNpsn = document.getElementById("npsnEdit").value;

            var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
            if (updtJenjang.length > 0 && updtStatus.length > 0 && updtSekolah.length > 0 && updtKecamatan.length > 0 && updtNpsn.length > 0) {

                firebase.database().ref('sekolah/' + updateID).update({
                    jenjang: updtJenjang,
                    sekolah: updtSekolah,
                    npsn: updtNpsn,
                    status: updtStatus,
                    createAt: createAt,
                });

                // window.alert("Data Sekolah Berhasil Diperbaharui");
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
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Data Belum Lengkap',
                  })
            }

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
                html: '<h6>Apakah Anda yakin ingin menghapus data <span class="fw-bold">Sekolah </span>?, data yang sudah di hapus tidak dapat dikembalikan lagi</h6> ',
                showCancelButton: true,
                confirmButtonText: 'Hapus',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    firebase.database().ref('sekolah/' + id).remove();
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil Dihapus',
                    })
                }
            })
        });

    }])