angular.module('app.PengaturanAdminSekolah', [])

    .controller('PengaturanAdminSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
       
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
        
        $('#btn-data-ranking').on('click', function () {
            if ($('#btn-data-ranking').hasClass('selected')) {
                $('#btn-data-ranking').removeClass('selected');
            } else {
                $('#btn-data-ranking').addClass('selected');
            }
        });
        var userID = $stateParams.idUser;

        $scope.nightActive = function () {
            if($("#nightmode").hasClass("night-active")){
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light');
                $("#menu-toggle, .nav-link").addClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").addClass('text-light').removeClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-dark').removeClass('text-light');
                $("#icon-night ").addClass('fa fa-moon text-light').removeClass('far fa-sun');
                $("#small-header, footer, p.fw-bold").addClass('text-light').removeClass('text-muted');

                $("#jadwal, #chart-s, .card-header").addClass('bg-night-side');
                $("li.montserrat").addClass('bg-night-side text-light');
                $(".card").addClass('bg-night-side card-border-night').removeClass('card-border-light');
                 $("#btn-look-pass, #btn-back ").addClass('btn-primary').removeClass('btn-outline-primary');
            }else{
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-light').removeClass('bg-night');
                $(".accordion-button").removeClass('accordion-button-dark bg-night text-light');
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
        
        $scope.beranda = function () {
            $state.go('berandaAdminSekolah');
        }
        $scope.data_pendaftar = function () {
            $state.go('dataPendaftar');
        }
        $scope.pengaturan = function () {
            $state.go('PengaturanAdminSekolah');
        }

        $scope.pengaturan_admin = function () {
            $state.go('EditAdminSekolah');
        }

        $scope.pengaturan_sekolah = function () {
            $state.go('EditDataSekolah');
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
                                    "email": dataSnapShot.val().email,
                                    "password": dataSnapShot.val().passwordDisplay,
                                    "npsn": dataSnapShot.val().npsn,
                                    "noHp": dataSnapShot.val().noHp,
                                };
                             
                            })
                        });
                        // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                        // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                        // var exc = npsnExc.includes($scope.formData.npsn);
                        // if (exc) {
                        //     disListRayon.style.display = "block";
                        // }
                                        // CEK KUOTA 
                // console.log(npsn)
                
                let cekKuota = firebase.database().ref('sekolah').child($scope.formData.npsn);
                cekKuota.on('value', (dataSnapShot) => {
                    $scope.formSekolah = {
                        "kuota": dataSnapShot.val().kuota,
                        "penyaluran": dataSnapShot.val().penyaluran,
                        "penyaluranAfirmasi": dataSnapShot.val().penyaluranAfirmasi,
                        "penyaluranPrestasi": dataSnapShot.val().penyaluranPrestasi,
                        "penyaluranPerpindahan": dataSnapShot.val().penyaluranPerpindahan,

                        "kuota_zonasi": dataSnapShot.val().kuota_zonasi,
                        "kuota_afirmasi": dataSnapShot.val().kuota_afirmasi,
                        "kuota_prestasi": dataSnapShot.val().kuota_prestasi,
                        "kuota_perpindahan": dataSnapShot.val().kuota_perpindahan,


                        "persentase_zonasi": dataSnapShot.val().persentase_zonasi,
                        "persentase_afirmasi": dataSnapShot.val().persentase_afirmasi,
                        "persentase_prestasi": dataSnapShot.val().persentase_prestasi,
                        "persentase_perpindahan": dataSnapShot.val().persentase_perpindahan,

                    };

                    console.log($scope.formSekolah.penyaluran);
                    if ($scope.formSekolah.penyaluran == undefined) {
                        $scope.formSekolah.penyaluran = 0;
                    } else {
                        console.log('ADA PENYALURAN')
                    }
                    if ($scope.formSekolah.penyaluranAfirmasi == undefined) {
                        $scope.formSekolah.penyaluranAfirmasi = 0;
                    } else {
                        console.log('ADA PENYALURAN AFIRMASI')
                    }
                    if ($scope.formSekolah.penyaluranPrestasi == undefined) {
                        $scope.formSekolah.penyaluranPrestasi = 0;
                    } else {
                        console.log('ADA PENYALURAN PRESTASI')
                    }
                    if ($scope.formSekolah.penyaluranPerpindahan == undefined) {
                        $scope.formSekolah.penyaluranPerpindahan = 0;
                    } else {
                        console.log('ADA PENYALURAN PERPINDAHAN')
                    }


                })
                    } else {
                        $ionicLoading.hide();
                        console.log('TIDAK AKTIF');
                        $state.go('welcome');
                    }

                })
                // var disListRayon = document.getElementById('list-siswa-luar-rayon');
                // var npsnExc = ["50100335", "50100315", "50100334", "50100327"];
                // var exc = npsnExc.includes($scope.formData.npsn);
                // if (exc) {
                //     disListRayon.style.display = "block";
                // }

                $scope.simpan_perubahanadmin = function () {
                    // $("#wrapper").toggleClass("toggled");
                    var edit_nama = document.getElementById("edit_nama_lengkap").value;
                    console.log(edit_nama);
                    var edit_password = document.getElementById("edit_password").value;
                    var edit_noHp = document.getElementById("edit_noHp").value;
                    firebase.database().ref('admin_sekolah/' + useraktif.uid).update({
                        nama: edit_nama,
                        passwordDisplay: edit_password,
                        noHp: edit_noHp
                    });
                    // window.alert('DATA BERHASIL DI UPDATE');
                    Swal.fire({
                        icon: 'success',
                        title: 'Sukses',
                        text: 'Data Berhasil di Update',
                    })
                }


                $scope.simpan_persentase = function () {
                    var persentase_zonasi = document.getElementById("persentase_zonasi").value;
                    var persentase_afirmasi = document.getElementById("persentase_afirmasi").value;
                    var persentase_prestasi = document.getElementById("persentase_prestasi").value;
                    var persentase_perpindahan = document.getElementById("persentase_perpindahan").value;

                    var kuotaSekolah = document.getElementById("kuotaSekolah").value;
                    console.log("click")

                    var kuota_zonasibaru = Math.round((parseFloat(persentase_zonasi) / 100) * parseInt(kuotaSekolah) + parseInt($scope.formSekolah.penyaluran));
                    var kuota_afirmasibaru = Math.round((parseFloat(persentase_afirmasi) / 100) * parseInt(kuotaSekolah) + parseInt($scope.formSekolah.penyaluranAfirmasi));
                    var kuota_perpindahanbaru = Math.round((parseFloat(persentase_perpindahan) / 100) * parseInt(kuotaSekolah) + parseInt($scope.formSekolah.penyaluranPerpindahan));
                    var kuota_prestasibaru = Math.round((parseFloat(persentase_prestasi) / 100) * parseInt(kuotaSekolah) + + parseInt($scope.formSekolah.penyaluranPrestasi));

                    // CEK PERSENTASE 

                    var cek_persentase = parseFloat(persentase_zonasi) + parseFloat(persentase_afirmasi) + parseFloat(persentase_perpindahan) + parseFloat(persentase_prestasi);
                    console.log('CEK PERSENTASE : ' + cek_persentase);

                    if (cek_persentase > 100) {

                        var selisih = cek_persentase - 100;
                        console.log(selisih);

                        // window.alert('JUMLAH PERSENTASE YANG ANDA MASUKAN LEBIH DARI 100%, JUMLAH LEBIH = ' + selisih + '%')
                        const swalAlert = Swal.mixin({
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                        })
                        swalAlert.fire({
                            title: 'EDIT DATA GAGAL',
                            text: 'JUMLAH PERSENTASE YANG ANDA MASUKAN LEBIH DARI 100%, JUMLAH LEBIH = ' + selisih + '%',
                            icon: 'error',
                        })

                    }
                    else if (cek_persentase < 100) {
                        var selisih = cek_persentase - 100;
                        console.log(selisih);

                        // window.alert('JUMLAH PERSENTASE YANG ANDA MASUKAN KURANG DARI 100%, JUMLAH KURANG = ' + selisih + '%')
                        const swalAlert = Swal.mixin({
                            customClass: {
                                confirmButton: 'btn btn-primary'
                            },
                            buttonsStyling: false
                        })
                        swalAlert.fire({
                            title: 'EDIT DATA GAGAL',
                            text: 'JUMLAH PERSENTASE YANG ANDA MASUKAN KURANG DARI 100%, JUMLAH KURANG = ' + selisih + '%',
                            icon: 'error',
                        })

                    }
                    else {
                        $ionicLoading.show();
                        firebase.database().ref('sekolah/' + $scope.formData.npsn).update({
                            kuota: String(kuotaSekolah),
                            kuota_zonasi: String(kuota_zonasibaru),
                            kuota_afirmasi: String(kuota_afirmasibaru),
                            kuota_prestasi: String(kuota_prestasibaru),
                            kuota_perpindahan: String(kuota_perpindahanbaru),

                            persentase_zonasi: persentase_zonasi,
                            persentase_afirmasi: persentase_afirmasi,
                            persentase_prestasi: persentase_prestasi,
                            persentase_perpindahan: persentase_perpindahan,


                        });
                        $ionicLoading.hide();
                        // window.alert('DATA BERHASIL DI UPDATE')
                        $("#alert-update-success").show(function () {
                            $("#alert-update-success").fadeTo(2000, 500).slideUp(500, function () {
                                $("#alert-update-success").slideUp(500);
                            });
                        });


                    }


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
            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });


    }])

    .controller('EditAdminSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-update-success").hide();
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
        $scope.lookPassword = function () {
            var x = document.getElementById("edit_password2");
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
                                    "email": dataSnapShot.val().email,
                                    "password": dataSnapShot.val().passwordDisplay,
                                    "noHp": dataSnapShot.val().noHp,
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

                $scope.simpan_perubahanadmin = function () {
                    // $("#wrapper").toggleClass("toggled");
                    var edit_nama = document.getElementById("edit_nama_lengkap").value;
                    console.log(edit_nama);
                    var edit_password = document.getElementById("edit_password").value;
                    var edit_noHp = document.getElementById("edit_noHp").value;
                    firebase.database().ref('admin_sekolah/' + useraktif.uid).update({
                        nama: edit_nama,
                        passwordDisplay: edit_password,
                        noHp: edit_noHp
                    });
                    // window.alert('DATA BERHASIL DI UPDATE');
                    $("#alert-updateAkun-success").show(function () {
                        $("#alert-updateAkun-success").fadeTo(2000, 500).slideUp(500, function () {
                            $("#alert-updateAkun-success").slideUp(500);
                        });
                    });
                }

            }
            else {
                $ionicLoading.hide();
                console.log('TIDAK AKTIF');
                $state.go('welcome');
            }
        });


    }])

    .controller('EditDataSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-update-success").hide();
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
                                    "namaSekolah": dataSnapShot.val().namaSekolah,
                                    "npsn": dataSnapShot.val().npsn,
                                };

                                // $scope.simpan_kuotaSekolah = function () {
                                //     // $("#wrapper").toggleClass("toggled");
                                //     var kuotaSekolah = document.getElementById("kuotaSekolah").value;
                                //     console.log(kuotaSekolah);

                                //     var persentase_zonasi = 50;
                                //     var persentase_afirmasi = 10;
                                //     var persentase_prestasi = 30;
                                //     var persentase_perpindahan = 10;

                                //     var kuota_zonasi = (persentase_zonasi / 100) * kuotaSekolah;
                                //     var kuota_afirmasi = (persentase_afirmasi / 100) * kuotaSekolah;
                                //     var kuota_prestasi = (persentase_prestasi / 100) * kuotaSekolah;
                                //     var kuota_perpindahan = (persentase_perpindahan / 100) * kuotaSekolah;

                                //     $ionicLoading.show()

                                //     firebase.database().ref('sekolah/' + $scope.formData.npsn).update({
                                //         kuota: String(kuotaSekolah),
                                //         kuota_zonasi: String(kuota_zonasi),
                                //         kuota_afirmasi: String(kuota_afirmasi),
                                //         kuota_prestasi: String(kuota_prestasi),
                                //         kuota_perpindahan: String(kuota_perpindahan),

                                //         persentase_zonasi: persentase_zonasi,
                                //         persentase_afirmasi: persentase_afirmasi,
                                //         persentase_prestasi: persentase_prestasi,
                                //         persentase_perpindahan: persentase_perpindahan,


                                //     });
                                //     $ionicLoading.hide()
                                //     window.alert('KUOTA SEKOLAH BERHASIL DI UPDATE');
                                // }

                                // CEK KUOTA 
                                console.log($scope.formData.npsn)
                                let cekKuota = firebase.database().ref('sekolah').child($scope.formData.npsn);
                                cekKuota.on('value', (dataSnapShot) => {
                                    $scope.formSekolah = {
                                        "kuota": dataSnapShot.val().kuota,
                                        "penyaluran": dataSnapShot.val().penyaluran,
                                        "penyaluranAfirmasi": dataSnapShot.val().penyaluranAfirmasi,
                                        "penyaluranPrestasi": dataSnapShot.val().penyaluranPrestasi,
                                        "penyaluranPerpindahan": dataSnapShot.val().penyaluranPerpindahan,

                                        "kuota_zonasi": dataSnapShot.val().kuota_zonasi,
                                        "kuota_afirmasi": dataSnapShot.val().kuota_afirmasi,
                                        "kuota_prestasi": dataSnapShot.val().kuota_prestasi,
                                        "kuota_perpindahan": dataSnapShot.val().kuota_perpindahan,


                                        "persentase_zonasi": dataSnapShot.val().persentase_zonasi,
                                        "persentase_afirmasi": dataSnapShot.val().persentase_afirmasi,
                                        "persentase_prestasi": dataSnapShot.val().persentase_prestasi,
                                        "persentase_perpindahan": dataSnapShot.val().persentase_perpindahan,

                                    };

                                    console.log($scope.formSekolah.penyaluran);
                                    if ($scope.formSekolah.penyaluran == undefined) {
                                        $scope.formSekolah.penyaluran = 0;
                                    } else {
                                        console.log('ADA PENYALURAN')
                                    }
                                    if ($scope.formSekolah.penyaluranAfirmasi == undefined) {
                                        $scope.formSekolah.penyaluranAfirmasi = 0;
                                    } else {
                                        console.log('ADA PENYALURAN AFIRMASI')
                                    }
                                    if ($scope.formSekolah.penyaluranPrestasi == undefined) {
                                        $scope.formSekolah.penyaluranPrestasi = 0;
                                    } else {
                                        console.log('ADA PENYALURAN PRESTASI')
                                    }
                                    if ($scope.formSekolah.penyaluranPerpindahan == undefined) {
                                        $scope.formSekolah.penyaluranPerpindahan = 0;
                                    } else {
                                        console.log('ADA PENYALURAN PERPINDAHAN')
                                    }

                                })


                                $scope.simpan_persentase = function () {
                                    var persentase_zonasi = document.getElementById("persentase_zonasi").value;
                                    var persentase_afirmasi = document.getElementById("persentase_afirmasi").value;
                                    var persentase_prestasi = document.getElementById("persentase_prestasi").value;
                                    var persentase_perpindahan = document.getElementById("persentase_perpindahan").value;

                                    var kuotaSekolah = document.getElementById("kuotaSekolah").value;
                                    console.log("click")


                                    var kuota_zonasibaru = Math.round((parseFloat(persentase_zonasi) / 100) * parseInt(kuotaSekolah) + parseInt($scope.formSekolah.penyaluran));
                                    var kuota_afirmasibaru = Math.round((parseFloat(persentase_afirmasi) / 100) * parseInt(kuotaSekolah) + parseInt($scope.formSekolah.penyaluranAfirmasi));
                                    var kuota_perpindahanbaru = Math.round((parseFloat(persentase_perpindahan) / 100) * parseInt(kuotaSekolah) + parseInt($scope.formSekolah.penyaluranPerpindahan));
                                    var kuota_prestasibaru = Math.round((parseFloat(persentase_prestasi) / 100) * parseInt(kuotaSekolah) + + parseInt($scope.formSekolah.penyaluranPrestasi));

                                    // CEK PERSENTASE 

                                    var cek_persentase = parseFloat(persentase_zonasi) + parseFloat(persentase_afirmasi) + parseFloat(persentase_perpindahan) + parseFloat(persentase_prestasi);
                                    console.log('CEK PERSENTASE : ' + cek_persentase);

                                    if (cek_persentase > 100) {

                                        var selisih = cek_persentase - 100;
                                        console.log(selisih);

                                        // window.alert('JUMLAH PERSENTASE YANG ANDA MASUKAN LEBIH DARI 100%, JUMLAH LEBIH = ' + selisih + '%')
                                        const swalAlert = Swal.mixin({
                                            customClass: {
                                                confirmButton: 'btn btn-primary'
                                            },
                                            buttonsStyling: false
                                        })
                                        swalAlert.fire({
                                            title: 'EDIT DATA GAGAL',
                                            text: 'JUMLAH PERSENTASE YANG ANDA MASUKAN LEBIH DARI 100%, JUMLAH LEBIH = ' + selisih + '%',
                                            icon: 'error',
                                        })

                                    }
                                    else if (cek_persentase < 100) {
                                        var selisih = cek_persentase - 100;
                                        console.log(selisih);

                                        // window.alert('JUMLAH PERSENTASE YANG ANDA MASUKAN KURANG DARI 100%, JUMLAH KURANG = ' + selisih + '%')
                                        const swalAlert = Swal.mixin({
                                            customClass: {
                                                confirmButton: 'btn btn-primary'
                                            },
                                            buttonsStyling: false
                                        })
                                        swalAlert.fire({
                                            title: 'EDIT DATA GAGAL',
                                            text: 'JUMLAH PERSENTASE YANG ANDA MASUKAN KURANG DARI 100%, JUMLAH KURANG = ' + selisih + '%',
                                            icon: 'error',
                                        })

                                    }
                                    else {
                                        $ionicLoading.show();
                                        firebase.database().ref('sekolah/' + $scope.formData.npsn).update({
                                            kuota: String(kuotaSekolah),
                                            kuota_zonasi: String(kuota_zonasibaru),
                                            kuota_afirmasi: String(kuota_afirmasibaru),
                                            kuota_prestasi: String(kuota_prestasibaru),
                                            kuota_perpindahan: String(kuota_perpindahanbaru),

                                            persentase_zonasi: persentase_zonasi,
                                            persentase_afirmasi: persentase_afirmasi,
                                            persentase_prestasi: persentase_prestasi,
                                            persentase_perpindahan: persentase_perpindahan,


                                        });
                                        $ionicLoading.hide();
                                        // window.alert('DATA BERHASIL DI UPDATE')
                                        $("#alert-update-success").show(function () {
                                            $("#alert-update-success").fadeTo(2000, 500).slideUp(500, function () {
                                                $("#alert-update-success").slideUp(500);
                                            });
                                        });


                                    }


                                }


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