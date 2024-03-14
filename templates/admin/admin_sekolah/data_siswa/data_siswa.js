angular.module('app.dataSiswaSMP', [])


    .controller('dataSiswaluarrayonCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

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
                            })
                        });


                        var ref = firebase.database().ref("smp/" +$scope.formData.npsn+"/datasiswa");
                        var listRef = $firebaseArray(ref);

                        listRef.$loaded().then(function (response) {
                            console.log(response);
                            $scope.siswa = response;
                        })
                        var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        var exc = npsnExc.includes($scope.formData.npsn);
                        if (exc) {
                            disListRayon.style.display = "block";
                            $scope.aksesTambah = true;
                        }
                        else {
                            console('TIDAK ADA AKSES');
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

                    if (namaSiswa.length != 0 && AlamatSiswa.length != 0 && npsnSiswa.length != 0 && NikSiswa.length != 0 && nisnSiswa.length >= 8 && SekolahSiswa.length != 0 && tglLahirSiswa.length != 0 && tempatLahirSiswa.length != 0) {
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

            $scope.updateSiswa = function(){
                var updtnama = document.getElementById("namaEdit").value ;
                var updtnisn = document.getElementById("nisnEdit").value;
                var updtnik = document.getElementById("nikEdit").value;
                var updtsekolah_asal = document.getElementById("sekolah_asalEdit").value ;
                var updtnpsn = document.getElementById("npsnEdit").value;
    
                var createAt = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss Z');
                if (updtnama.length > 0 && updtnisn.length > 8 && updtsekolah_asal.length > 0 && updtnpsn.length > 0) {
                    firebase.database().ref('datasiswa/'+updateID).update({
                        id_sd: updtnpsn,
                        nama: updtnama,
                        nik: updtnik,
                        sekolah_asal: updtsekolah_asal
                    }).then(function () {
                        firebase.database().ref("smp/" + $scope.formData.npsn + '/datasiswa/'+updateID).update({
                            id_sd: updtnpsn,
                            nama: updtnama,
                            nik: updtnik,
                            sekolah_asal: updtsekolah_asal
                        }).then(function () {
                            $ionicLoading.hide();
                            window.alert("Data Berhasil di Update");
                        });
                    });
    
                }
                else {
                    window.alert("Data Belum Lengkap");
                    $("#alert-dataSiswa-warning").show(function () {
                        $("#alert-dataSiswa-warning").fadeTo(2000, 500).slideUp(500, function () {
                            $("#alert-dataSiswa-warning").slideUp(500);
                        });
                    });
                }
            }
        });

                $scope.hapusSiswa = function(){

                }


            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }




        });

    }])