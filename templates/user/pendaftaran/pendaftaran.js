angular.module('app.pendaftaranuser', [])
    .controller('pendaftaranppdbCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-alterPass-danger").hide();

        // CHECK KONDISI PENGATURAN

        let cekBukaPendaftaran = firebase.database().ref('pengaturan').child('bukaPendaftaran');
        cekBukaPendaftaran.on('value', (dataSnapShot) => {
            $scope.cekPendaftaran = {
                // "nip": dataSnapShot.val().nip,
                "aktif": dataSnapShot.val().aktif,
            };
            console.log($scope.cekPendaftaran.aktif);
        })
        var cekBukaJalurZonasi = firebase.database().ref('pengaturan').child('buka_jalurZonasi');
        cekBukaJalurZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurZonasi = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurZonasi == false) {
                $('#div-jalur-zonasi').show();

            } else {
                $('#div-jalur-zonasi').hide();
            }
        })
        var cekBukaJalurAfirmasi = firebase.database().ref('pengaturan').child('buka_jalurAfirmasi');
        cekBukaJalurAfirmasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurAfirmasi = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurAfirmasi == false) {
                $('#div-jalur-afirmasi').show();

            } else {
                $('#div-jalur-afirmasi').hide();
            }
        })

        var cekBukaJalurPilihan = firebase.database().ref('pengaturan').child('buka_jalurPilihan');
        cekBukaJalurPilihan.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPilihan = dataSnapShot.val().aktif;
            console.log('JALUR PILIHAN ' + $scope.cekBukaJalurPilihan)
        })
        var cekBukaJalurPerpindahan = firebase.database().ref('pengaturan').child('buka_jalurPerpindahan');
        cekBukaJalurPerpindahan.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPerpindahan = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurPerpindahan == false) {
                $('#div-jalur-perpindahan').show();

            } else {
                $('#div-jalur-perpindahan').hide();
            }
        })
        var cekBukaJalurPrestasi = firebase.database().ref('pengaturan').child('buka_jalurPrestasi');
        cekBukaJalurPrestasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPrestasi = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurPrestasi == false) {
                $('#div-jalur-prestasi').show();

            } else {
                $('#div-jalur-prestasi').hide();
            }
        })

        // FUNCTION TOMBOL - TOMBOL
        $scope.myZone = function () {


            var map_zonasi
            map_zonasi = new google.maps.Map(document.getElementById('map_zonasi'), {
                center: {
                    lat: -7.960996,
                    lng: 112.618634
                },
                zoom: 16
            });
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map_zonasi);
            var directionsService = new google.maps.DirectionsService();

            var cekSekolahTujuan = firebase.database().ref('siswa/' + firebase.auth().currentUser.uid);
            cekSekolahTujuan.on("value", function (snapshot) {
                ////console.log(snapshot.val().status_skl);
                $scope.statusSKL = snapshot.val().status_skl;
                var startAddress = snapshot.val().alamatzonasi;
                var endAddress = snapshot.val().sekolahZonasiAlamat;
                var request = {
                    origin: startAddress,
                    destination: endAddress,
                    travelMode: 'DRIVING'
                };
                directionsService.route(request, function (result, status) {
                    if (status == 'OK') {
                        directionsDisplay.setDirections(result);

                        //console.log(result.routes[0].legs[0].distance.text);
                        //console.log(result.routes[0].legs[0].distance.value);
                        firebase.database().ref('siswa/' + firebase.auth().currentUser.uid).update({
                            jarak: parseInt(result.routes[0].legs[0].distance.value),
                        }).then(function () {
                            // location.reload();
                        });

                    } else {
                        // window.alert('Petunjuk arah gagal dimuat, masukkan alamat yang benar!')
                        // $('#modal_alert_map_arah').modal();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Alamat gagal dimuat, masukan alamat yang benar',
                            focusConfirm: false
                        })
                    }
                });

            })

            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (x.style.display === "block") {
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
                c.style.display = "none";
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
        }
        $scope.myZoneSwasta = function () {

            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (x.style.display === "block") {
                // x.style.display = "none";
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
                c.style.display = "none";
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
        }
        $scope.myAfirmation = function () {
            console.log('KLIK AFIRMASI')
            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (y.style.display === "block") {
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').addClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "none";
                y.style.display = "block";
                z.style.display = "none";
                c.style.display = "none";
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').addClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
        }
        $scope.myPrestasi = function () {
            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (z.style.display === "block") {
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').addClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "none";
                y.style.display = "none";
                z.style.display = "block";
                c.style.display = "none";
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').addClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }

        }
        $scope.myPindahan = function () {
            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (c.style.display === "block") {
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').addClass('on');
            }
            else {
                x.style.display = "none";
                y.style.display = "none";
                z.style.display = "none";
                c.style.display = "block";
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').addClass('on');
            }
        }
        $scope.alter_pen = function () {
            var alter_pass = document.getElementById('alter_pass').value;
            console.log(alter_pass);
            if (alter_pass == "hesoyam") {
                $('#modal_alter').modal('hide');
                $state.go('pendaftaran_alter');
            } else {
                $("#alert-alterPass-danger").show(function () {
                    $("#alert-alterPass-danger").fadeTo(2000, 500).slideUp(500, function () {
                        $("#alert-alterPass-danger").slideUp(500);
                    });
                });
            }
        }
        $scope.alertDashboardUser = function () {
            Swal.fire({
                icon: 'question',
                title: 'Selamat Datang',
                html:
                    '<div class="text-justify">Berikut Penjelasan singkat perihal <b>Tata Cara Pendaftaran </b> di sistem <b>e-PPDB</b>.' +
                    '<p>Proses Pendaftaran di bagi menjadi 2 Tahap</p> ' +
                    '<ol> <li> 1. Mengisi Data Diri & Upload Berkas</li>' +
                    '<li> 2. Pemilihan Jalur  </ol>' +
                    'Setelah Pengguna Memilih Jalur pada sekolah pilihan, data pendaftaran akan langsung masuk ke proses pemeriksaan oleh sekolah terkait. <br><br> ' +
                    'Setelah status data pendaftaran pengguna dinyatakan <b>SUDAH VALID</b>, proses pendaftaran pengguna sudah selesai. <br><br>' +
                    'Selanjutnya data pendaftaran pengguna akan di Ranking di Sekolah Terkait, jika lolos maka pengguna akan dapat dinyatakan terdaftar sebagai siswa di Sekolah Pilihan. <br><br>' +
                    'Jika Gagal Pengguna dapat mencoba mendaftar kembali di Jalur Lain.' +
                    'Sekian Penjelasan singkat perihal Alur Pendaftaran di Sistem <b>e-PPDB</b></div>',
                showCancelButton: true,
                confirmButtonText: 'Ok',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.localStorage.alertDashboardUser = "on";
                }
            })
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
                    $state.go('welcome');
                }
            })

        }
        $scope.printJalur = function () {
            var element = document.getElementById("buktidaftarZonasi");
            element.classList.add("no-print");
            var element2 = document.getElementById("buktidaftarJalur");
            element2.classList.remove("no-print");
            print();
        }
        $scope.printZonasi = function () {
            var element = document.getElementById("buktidaftarJalur");
            console.log(element);
            if (element != null) {
                element.classList.add("no-print");
                var element2 = document.getElementById("buktidaftarZonasi");
                element2.classList.remove("no-print");

                print();
            } else {
                print();
            }

        }

        $scope.checkScreen = function () {
            if ($(window).width() < 1200) {
                $('#badge-belum, #badge-sudah').addClass('btn-sm')
            }
            else {
                $('#badge-belum, #badge-sudah').removeClass('btn-sm')
            }
        }
        $(window).resize(function () {
            $scope.checkScreen();
        });
        $scope.checkScreen();

        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light').removeClass('bg-light');
                $("#menu-toggle, .nav-link, .far.fa-envelope").addClass('text-light');
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
                $("#menu-toggle, .nav-link, .far.fa-envelope").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
                // $(" #badge-belum ").removeClass('btn-danger').addClass('btn-outline-danger');
                // $(" #badge-sudah ").removeClass('btn-success').addClass('btn-outline-success');
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
        $scope.dashboard = function () {
            $state.go('dashboard');
        }
        $scope.pengumumanUser = function () {
            $state.go('pengumuman');
        }
        $scope.pengaturanUser = function () {
            $state.go('pengaturanUser');
        }
        $scope.pendaftaran_kembali = function () {
            $ionicLoading.show();
            $state.go('pendaftaran_kembali');
        }

        // MAIN FUNCTION
        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var start = document.getElementById('daftar_alamatzonasi');
                new google.maps.places.SearchBox(start);
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid);
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('siswa/' + useraktif.uid);
                pengguna.on("value", function (snapshot) {
                    // console.log(snapshot.val())

                    
                    if (snapshot.val() != null) {

                        snapshot.forEach(function (data) {
                            let firebaseRefKey = firebase.database().ref('siswa/' + useraktif.uid);
                            firebaseRefKey.on('value', (dataSnapShot) => {

                                $scope.formData = {
                                    "nisn": dataSnapShot.val().nisn,
                                    "nama": dataSnapShot.val().nama,
                                    "jenis_kelamin": dataSnapShot.val().jenis_kelamin,

                                    "nik": dataSnapShot.val().nik,
                                    "id_sd": dataSnapShot.val().id_sd,
                                    "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                    "alamat": dataSnapShot.val().alamat,
                                    "tempat_lahir": dataSnapShot.val().tempat_lahir,
                                    "tanggal_lahir": dataSnapShot.val().tanggal_lahir,
                                    "idDesa": dataSnapShot.val().idDesa,
                                    "no_pendaftaran": dataSnapShot.val().no_pendaftaran,
                                    "no_pendaftaran2": dataSnapShot.val().no_pendaftaran2,
                                    "sekolahZonasi": dataSnapShot.val().sekolahZonasi,
                                    "sekolahJalur": dataSnapShot.val().sekolahJalur,
                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "jarak": dataSnapShot.val().jarak,
                                    "jalur": dataSnapShot.val().jalur,
                                    "jalurNama": dataSnapShot.val().jalurNama,
                                    "jalur2": dataSnapShot.val().jalur2,
                                    "jalurNama2": dataSnapShot.val().jalurNama2,
                                    "noKK": dataSnapShot.val().noKK,
                                    // "nomor_skl": dataSnapShot.val().nomor_skl,
                                    // "nilai_skl": dataSnapShot.val().nilai_skl,


                                    "idKecamatan": dataSnapShot.val().idKecamatan,
                                    "namaKecamatan": dataSnapShot.val().namaKecamatan,
                                    "idDesa": dataSnapShot.val().idDesa,
                                    "namaDesa": dataSnapShot.val().namaDesa,
                                    "alamatzonasi": dataSnapShot.val().alamatzonasi,
                                    "koreksi": dataSnapShot.val().koreksi,
                                    "umur": dataSnapShot.val().umur,
                                    "umur_display": dataSnapShot.val().umur_display,
                                    "statusKK": dataSnapShot.val().statusKK,

                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "sekolahZonasi": dataSnapShot.val().sekolahZonasi,

                                };
                                $scope.CheckPhoto = dataSnapShot.val().jenis_kelamin;
                                $scope.statusvalidasi = dataSnapShot.val().status_uprove;
                                $scope.statusvalidasi2 = dataSnapShot.val().status_uprove2;
                                $scope.statusdaftar = dataSnapShot.val().status_daftar;
                                $scope.statusdaftarZonasi = dataSnapShot.val().status_daftarZonasi;
                                $scope.statusdaftarJalur = dataSnapShot.val().status_daftarJalur;
                                $scope.statusdaftarSwasta = dataSnapShot.val().pilihSwasta;

                                $scope.sklhNama1 = dataSnapShot.val().sekolahZonasi;
                                $scope.sklhId1 = dataSnapShot.val().idsekolah_zonasi;
                                $scope.sklhAlamat1 = dataSnapShot.val().sekolahZonasiAlamat;

                                // console.log( $scope.sklhAlamat1 );


                                // TEMPAT DI PILIH DESA

                                $ionicLoading.hide();

                                $scope.form = {
                                    "idKecamatan": $scope.formData.idKecamatan,
                                    "idDesa": $scope.formData.idDesa,
                                }

                                var refKecamatan = firebase.database().ref("kecamatan");
                                $scope.dataKecamatan = $firebaseArray(refKecamatan);
                                var refDesa = firebase.database().ref("desa");
                                $scope.dataDesa = $firebaseArray(refDesa);

                                var idDesa = $scope.form.idDesa;
                                $scope.idDesa = $scope.form.idDesa;
                                //Get Nama Kecamatan
                                var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
                                var listNamaDesa = $firebaseArray(namaDesa);
                                listNamaDesa.$loaded().then(function (response) {
                                    $scope.formData.namaDesa = response[0].nama_desa;
                                    $scope.formData.idDesa = response[0].id_desa;

                                    // $scope.sklhNama1 = response[0].nama_smp;
                                    // $scope.sklhId1 = response[0].id_smp;
                                    // $scope.sklhAlamat1 = response[0].alamat_smp;


                                });

                                var refSekolah = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo('SMP');;
                                $scope.dataSekolah = $firebaseArray(refSekolah);


                                var refSekolahSwasta = firebase.database().ref("sekolahSwasta").orderByChild("jenjang").equalTo('SMP');
                                $scope.dataSekolahSwasta = $firebaseArray(refSekolahSwasta);

                                $scope.getIdKecamatan = function () {
                                    var idKecamatan = $scope.form.idKecamatan;
                                    $scope.idKecamatan = $scope.form.idKecamatan;
                                    //Get Nama Kecamatan
                                    var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
                                    var listNamaKecamatan = $firebaseArray(namaKecamatan);
                                    listNamaKecamatan.$loaded().then(function (response) {
                                        $scope.formData.namaKecamatan = response[0].nama_kecamatan;
                                        $scope.formData.idKecamatan = response[0].id_kecamatan;

                                    });

                                    // var refDesa = firebase.database().ref("desa").orderByChild("id_kecamatan").equalTo(idKecamatan);
                                    // $scope.dataDesa = $firebaseArray(refDesa);
                                }

                                // KLIK BERIKUTNYA
                                $scope.simpan1 = function () {

                                    // $("#modal_simpan").modal('hide')
                                    var alamatzonasi = document.getElementById("daftar_alamatzonasi").value;
                                    var noKK = document.getElementById("daftar_noKK").value;
                                    var statusKK = document.getElementById("daftar_statusKK").value;
                                    var daftarSwasta = document.getElementById("daftar_swastaOnly").value;
                                    var swasta;
                                    // FILE Kartu Keluarga
                                    var storageRef = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Skl');
                                    var storage = $firebaseStorage(storageRef);
                                    var file = document.querySelector("#inputSkl").files[0];

                                    if (noKK != '') {

                                        if (file != undefined) {
                                            const swalDaftarZonasi = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalDaftarZonasi.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Pastikan data yang dimasukan sudah benar. Klik Lanjut untuk melanjutkan pendaftaran',
                                                showCancelButton: true,
                                                confirmButtonText: 'Lanjut',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {

                                                    $ionicLoading.show();

                                                    var metadata = {
                                                        contentType: file.type
                                                    }
                                                    //Upload File
                                                    var uploadTask = storage.$put(file);
                                                    uploadTask.$complete(function (snapshot) {
                                                        storageRef.getDownloadURL().then(function (url) {
                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/file');
                                                            refAddFoto.set({
                                                                "URL": url,
                                                                "namaFile": snapshot.metadata.name
                                                            }).then(function (response) {

                                                                if (daftarSwasta == 'true') {
                                                                    swasta = true;
                                                                } else {
                                                                    swasta = false
                                                                }
                                                                // MENDAFTAR SEKOLAH SWASTA
                                                                if (swasta == true) {
                                                                    console.log('PILIHAN SEKOLAH SWASTA')

                                                                    if (alamatzonasi.length > 0 && noKK.length > 0 && statusKK.length > 0) {
                                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                            status_daftar: false,
                                                                            status_daftarZonasi: false,
                                                                            status_daftarJalur: false,
                                                                            status_skl: true,
                                                                            status_terima: false,
                                                                            status_uprove: false,
                                                                            idKecamatan: $scope.formData.idKecamatan,
                                                                            namaKecamatan: $scope.formData.namaKecamatan,
                                                                            idDesa: $scope.formData.idDesa,
                                                                            namaDesa: $scope.formData.namaDesa,
                                                                            koreksi: null,
                                                                            sekolahZonasiId: '',
                                                                            sekolahZonasi: '',
                                                                            sekolahZonasiAlamat: '',
                                                                            alamatzonasi: alamatzonasi,
                                                                            noKK: noKK,
                                                                            statusKK: statusKK,
                                                                            kombinasiZonasi: $scope.formData.idDesa + '-' + $scope.formData.id_sd,
                                                                            pilihSwasta: true,
                                                                        }).then(function () {
                                                                            $ionicLoading.hide();
                                                                        });
                                                                    } else {
                                                                        $ionicLoading.hide();
                                                                        Swal.fire({
                                                                            icon: 'warning',
                                                                            title: 'Perhatian',
                                                                            text: 'Data Tidak Boleh Kosong',
                                                                            focusConfirm: false
                                                                        })

                                                                    }

                                                                } else {



                                                                    // MENDAFTAR SEKOLAH NEGERI
                                                                    console.log('PILIHAN SEKOLAH NEGERI')
                                                                    console.log("JALUR DESA");
                                                                    console.log($scope.sklhAlamat1);

                                                                    if (alamatzonasi.length > 0 && noKK.length > 0 && statusKK.length > 0) {
                                                                        console.log('HITUNG JARAK');

                                                                        console.log('1 Sekolah Terdekat');
                                                                        var map;
                                                                        map = new google.maps.Map(document.getElementById('map'), {
                                                                            center: {
                                                                                lat: -7.960996,
                                                                                lng: 112.618634
                                                                            },
                                                                            zoom: 16
                                                                        });

                                                                        var directionsDisplay = new google.maps.DirectionsRenderer();
                                                                        directionsDisplay.setMap(map);
                                                                        var start = document.getElementById('daftar_alamatzonasi');
                                                                        console.log('START' + start);
                                                                        var searchStart = new google.maps.places.SearchBox(start);

                                                                        var directionsService = new google.maps.DirectionsService();

                                                                        var cekSekolahTujuan = firebase.database().ref('siswa/' + useraktif.uid);
                                                                        cekSekolahTujuan.on("value", function (snapshot) {

                                                                            $scope.statusSKL = snapshot.val().status_skl;
                                                                            var startAddress = snapshot.val().alamatzonasi;
                                                                            var endAddress1 = $scope.sklhAlamat1;
                                                                            var tempjarak1;

                                                                            // HITUNG JARAK 1
                                                                            var request1 = {
                                                                                origin: startAddress,
                                                                                destination: endAddress1,
                                                                                travelMode: 'DRIVING'
                                                                            };


                                                                            directionsService.route(request1, function (result, status) {
                                                                                if (status == 'OK') {
                                                                                    directionsDisplay.setDirections(result);
                                                                                    console.log(result.routes[0].legs[0].distance.text);
                                                                                    console.log(result.routes[0].legs[0].distance.value);

                                                                                    tempjarak1 = parseInt(result.routes[0].legs[0].distance.value)

                                                                                    if (tempjarak1 >= parseInt(25000)) {
                                                                                        Swal.fire({
                                                                                            icon: 'error',
                                                                                            title: 'Error',
                                                                                            text: 'Kordinat tempat tinggal anda lebih dari 25km ke sekolah zonasi, harap hubungi admin sekolah untuk perbaikan data',
                                                                                            focusConfirm: false
                                                                                        })
                                                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                                            status_skl: false,
                                                                                        })
                                                                                    }

                                                                                } else {
                                                                                    Swal.fire({
                                                                                        icon: 'error',
                                                                                        title: 'Error',
                                                                                        text: 'Alamat gagal dimuat, masukan alamat yang benar',
                                                                                        focusConfirm: false
                                                                                    })
                                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                                        status_skl: false,
                                                                                    })
                                                                                }
                                                                            }).then(function () {

                                                                                console.log('JARAK 1 ' + tempjarak1 + ' ' + $scope.sklhNama1 + ' ' + $scope.sklhId1);

                                                                                const pilihJarak = [tempjarak1];
                                                                                pilihJarak.sort(function (a, b) { return a - b });

                                                                                console.log(pilihJarak[0]);
                                                                                if (pilihJarak[0] == tempjarak1) {

                                                                                    $scope.sklhId = $scope.sklhId1;
                                                                                    $scope.sklhNama = $scope.sklhNama1;
                                                                                    $scope.sklhAlamat = $scope.sklhAlamat1;

                                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                                        status_daftar: false,
                                                                                        status_daftarZonasi: false,
                                                                                        status_daftarJalur: false,
                                                                                        status_skl: true,
                                                                                        status_terima: false,
                                                                                        status_uprove: false,
                                                                                        idKecamatan: $scope.formData.idKecamatan,
                                                                                        namaKecamatan: $scope.formData.namaKecamatan,
                                                                                        idDesa: $scope.formData.idDesa,
                                                                                        namaDesa: $scope.formData.namaDesa,
                                                                                        alamatzonasi: alamatzonasi,
                                                                                        noKK: noKK,
                                                                                        statusKK: statusKK,
                                                                                        kombinasiZonasi: $scope.formData.idDesa + '-' + $scope.formData.id_sd,

                                                                                        // UPDATE JARAK
                                                                                        jarak: tempjarak1,
                                                                                        sekolahZonasiId: $scope.sklhId,
                                                                                        sekolahZonasi: $scope.sklhNama,
                                                                                        sekolahZonasiAlamat: $scope.sklhAlamat,
                                                                                    }).then(function () {
                                                                                        $state.go('pendaftaran_ppdb');
                                                                                    });

                                                                                } else {
                                                                                    console.log("SALAH");
                                                                                }
                                                                            })
                                                                        })

                                                                        $ionicLoading.hide();

                                                                    } else {
                                                                        $ionicLoading.hide();
                                                                        // window.alert('Data tidak boleh kosong');
                                                                        Swal.fire({
                                                                            icon: 'warning',
                                                                            title: 'Perhatian',
                                                                            text: 'Data tidak boleh kosong',
                                                                            focusConfirm: false
                                                                        })
                                                                        // $('modal_alert_data').modal();
                                                                    }
                                                                }

                                                            }).then(function (error) {
                                                                ////console.log(error);
                                                            });
                                                        }).catch(function (error) {
                                                            // Handle any errors
                                                        });
                                                    })
                                                }
                                                else {
                                                    console.log('Batal')
                                                }

                                            })

                                        } else {
                                            // window.alert('FILE TIDAK BOLEH KOSONG');
                                            $ionicLoading.hide();
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'File tidak boleh kosong',
                                                focusConfirm: false
                                            })
                                        }
                                    } else {
                                        // window.alert('FILE TIDAK BOLEH KOSONG');
                                        $ionicLoading.hide();
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Nomor KK tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }

                                }

                                $scope.pilihanSekolah1 = $scope.formData.sekolahZonasi;
                                $scope.pilihanSekolah2 = $scope.formData.sekolahJalur;
                                $scope.jarak = $scope.formData.jarak;
                                $scope.jalur = $scope.formData.jalur;
                                $scope.jalurNama = $scope.formData.jalurNama;

                                $scope.jalur2 = $scope.formData.jalur2;
                                $scope.jalurNama2 = $scope.formData.jalurNama2;
                                $scope.koreksi = $scope.formData.koreksi;

                                ////console.log($scope.jalur);
                                var idDesa = $scope.formData.idDesa;

                                var poinStatusKK;

                                if ($scope.formData.statusKK == 'Famili Lain') {
                                    poinStatusKK = 2;
                                } else {
                                    poinStatusKK = 1;
                                }

                                // DAFTAR JALUR LAIN
                                $scope.daftarJalurLain = function () {
                                    // window.alert('JALUR LAIN')
                                    $("#modal_daftarJalurWarning").modal('hide')
                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                        status_daftar: false,
                                    });
                                }

                                // DAFTAR ZONASI
                                $scope.daftarzonasi = function () {
                                    const swalDaftarZonasi = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalDaftarZonasi.fire({
                                        title: 'Daftar Jalur Zonasi',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin mendaftar di jalur zonasi ?',
                                        showCancelButton: true,
                                        confirmButtonText: 'Daftar',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            $ionicLoading.show();

                                            $("#modal_simpan_zonasi").modal('hide')
                                            var jarak = document.getElementById("jarak").value;
                                            var smpPil = document.getElementById("smpPil").value;
                                            console.log(poinStatusKK);
                                            console.log(jarak);
                                            console.log($scope.formData.umur);
                                            var umur = $scope.formData.umur;

                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);

                                            console.log(point);

                                            console.log($scope.formData.nama);



                                            firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                nama: $scope.formData.nama,
                                                nisn: $scope.formData.nisn,
                                                sekolah_asal: $scope.formData.sekolah_asal,
                                                jarak: parseInt(jarak),
                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                finalPoin: point,
                                                id_sd: $scope.formData.id_sd,
                                                jalur: 'zonasi',
                                                jalurNama: 'Zonasi',
                                                status_uprove: false,
                                                statusKK: $scope.formData.statusKK,
                                                no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                uid: useraktif.uid,

                                            }).then(function () {
                                                firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                    nama: $scope.formData.nama,
                                                    nisn: $scope.formData.nisn,
                                                    smpPilZonasi: smpPil,
                                                    id_smpPilZonasi: $scope.formData.sekolahZonasiId,
                                                    jarak: parseInt(jarak),
                                                    poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                    finalPoin: point,
                                                    jalur: 'zonasi',
                                                    jalurNama: 'Zonasi',
                                                    status_uprove: false,
                                                    no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                    uid: useraktif.uid,
                                                }).then(function () {

                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                        status_daftar: true,
                                                        status_daftarZonasi: true,
                                                        smpPilZonasi: smpPil,
                                                        smpPilZonasiid: $scope.formData.sekolahZonasiId,
                                                        jarak: parseInt(jarak),
                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        finalPoin: point,
                                                        jalur: 'zonasi',
                                                        jalurNama: 'Zonasi',
                                                        status_uprove: false,
                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                    }).then(function () {
                                                        $ionicLoading.hide();
                                                        $state.go('pendaftaran_ppdb');
                                                        var x = document.getElementById("zonasi");
                                                        x.style.display = "none";
                                                    })
                                                })
                                            })
                                        }
                                    })
                                }

                                // DAFTAR Zonasi Swasta
                                $scope.daftarzonasiSwasta = function () {
                                    $ionicLoading.show();

                                    var sekolahSwasta = document.getElementById("pilihanSekolahSwasta").value;
                                    var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahSwasta);
                                    var listNamaSekolah = $firebaseArray(namaSekolah);
                                    listNamaSekolah.$loaded().then(function (response) {
                                        $scope.namaSekolah = response[0].sekolah;
                                        console.log($scope.namaSekolah);
                                        console.log(sekolahSwasta);

                                        // MASUK KE SEKOLAH 1
                                        firebase.database().ref('smp/' + sekolahSwasta + '/zonasi/' + useraktif.uid).update({
                                            nama: $scope.formData.nama,
                                            nisn: $scope.formData.nisn,
                                            sekolah_asal: $scope.formData.sekolah_asal,
                                            jarak: '0',
                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                            finalPoin: parseFloat((poinStatusKK.toString() + '.0' + '.' + $scope.formData.umur.toString())),
                                            finalPoin2: parseFloat(('0.' + $scope.formData.umur.toString())),
                                            jalur: 'zonasi',
                                            jalurNama: 'Zonasi',
                                            status_uprove: false,
                                            no_pendaftaran: 'zonasi/2023/' + sekolahSwasta + '/' + $scope.formData.nisn,
                                            uid: useraktif.uid,

                                        });

                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                            nama: $scope.formData.nama,
                                            nisn: $scope.formData.nisn,
                                            smpPil: $scope.namaSekolah,
                                            smpPilZonasi: sekolahSwasta,
                                            jarak: '0',
                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                            finalPoin: parseFloat((poinStatusKK.toString() + '.0' + '.' + $scope.formData.umur.toString())),
                                            finalPoin2: parseFloat(('0.' + $scope.formData.umur.toString())),
                                            jalur: 'zonasi',
                                            jalurNama: 'Zonasi',
                                            status_uprove: false,
                                            no_pendaftaran: 'zonasi/2023/' + sekolahSwasta + '/' + $scope.formData.nisn,
                                            uid: useraktif.uid,
                                        });

                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                            status_daftar: true,
                                            status_daftarZonasi: true,

                                            jarak: '0',
                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                            finalPoin: parseFloat((poinStatusKK.toString() + '.0' + '.' + $scope.formData.umur.toString())),
                                            finalPoin2: parseFloat(('0.' + $scope.formData.umur.toString())),
                                            jalur: 'zonasi',
                                            jalurNama: 'Zonasi',
                                            status_uprove: false,
                                            no_pendaftaran: 'zonasi/2023/' + sekolahSwasta + '/' + $scope.formData.nisn,
                                            sekolahZonasi: $scope.namaSekolah,
                                            sekolahZonasiId: sekolahSwasta,

                                        });

                                    });
                                    // $state.go('pendaftaran_ppdb');
                                }

                                // DAFTAR AFIRMASI
                                $scope.daftarafirmasi = function () {
                                    const swalDaftarAfirmasi = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalDaftarAfirmasi.fire({
                                        title: 'Daftar Jalur Afirmasi',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin mendaftar di jalur afirmasi ?',
                                        showCancelButton: true,
                                        confirmButtonText: 'Daftar',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            if ($scope.statusdaftarZonasi == true) {
                                                $("#modal_simpan_afirmasi").modal('hide')
                                                $ionicLoading.show();
                                                // $("#modal_simpan_zonasi").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;

                                                var umur = $scope.formData.umur;

                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);

                                                var dokumenAfirmasi = document.getElementById("jenisDokumen").value;
                                                //console.log(dokumenAfirmasi);
                                                var sekolahAfirmasi = $scope.form.idSekolahAfirmasi;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahAfirmasi);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    // console.log($scope.namaSekolah);
                                                    console.log(sekolahAfirmasi);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahAfirmasi == sekolahZonasi) {
                                                        // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        })
                                                        $ionicLoading.hide();
                                                        // MASUK KE SEKOLAH 1
                                                        // firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     uid: useraktif.uid,

                                                        //     // jarak: parseInt(jarak),
                                                        //     // finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     // jalur: 'zonasi',
                                                        //     // jalurNama: 'Zonasi',
                                                        //     // status_uprove: false,
                                                        //     // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,


                                                        // });

                                                        // // MASUK KE SEKOLAH 2
                                                        // firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     status_uprove: false,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     uid: useraktif.uid,

                                                        // });

                                                        // firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     smpPil: $scope.namaSekolah,
                                                        //     smpPilZonasi: smpPilZonasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // firebase.database().ref('siswa/' + useraktif.uid).update({
                                                        //     status_daftar: true,
                                                        //     status_daftarZonasi: true,
                                                        //     status_daftarJalur: true,
                                                        //     dokumenAfirmasi: dokumenAfirmasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // // MASUK KE SEKOLAH 2


                                                        // // File 
                                                        // var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        // var storageDok = $firebaseStorage(storageRefDok);
                                                        // var fileDok = document.getElementById("inputberkas").files[0];

                                                        // var metadata = {
                                                        //     contentType: fileDok.type
                                                        // }
                                                        // //Upload File
                                                        // ////console.log(file);
                                                        // var uploadTask = storageDok.$put(fileDok);
                                                        // $ionicLoading.show();

                                                        // uploadTask.$complete(function (snapshot) {
                                                        //     //console.log(snapshot);
                                                        //     storageRefDok.getDownloadURL().then(function (url) {
                                                        //         //console.log(url);
                                                        //         var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                        //         refAddFoto.set({
                                                        //             "URL": url,
                                                        //             "namaFile": snapshot.metadata.name
                                                        //         }).then(function (response) {
                                                        //             $ionicLoading.hide();
                                                        //             ////console.log(response);
                                                        //             return true;
                                                        //         }).then(function (error) {
                                                        //             ////console.log(error);
                                                        //         });
                                                        //     }).catch(function (error) {
                                                        //         // Handle any errors
                                                        //     });
                                                        // })
                                                        // $ionicLoading.hide();
                                                        // // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            statusKK: $scope.formData.statusKK,
                                                            uid: useraktif.uid,

                                                            // status_uprove: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,

                                                        });


                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            dokumenAfirmasi: dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        // MASUK KE SEKOLAH 2


                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("inputberkas").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')

                                                    }

                                                });
                                                // $state.go('pendaftaran_ppdb');
                                            } else {
                                                $("#modal_simpan_afirmasi").modal('hide')
                                                $ionicLoading.show();
                                                // $("#modal_simpan_zonasi").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;

                                                var umur = $scope.formData.umur;

                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);

                                                var dokumenAfirmasi = document.getElementById("jenisDokumen").value;
                                                //console.log(dokumenAfirmasi);
                                                var sekolahAfirmasi = $scope.form.idSekolahAfirmasi;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahAfirmasi);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    // console.log($scope.namaSekolah);
                                                    console.log(sekolahAfirmasi);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahAfirmasi == sekolahZonasi) {
                                                        // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        })
                                                        $ionicLoading.hide();
                                                        // MASUK KE SEKOLAH 1
                                                        // firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     uid: useraktif.uid,

                                                        //     // jarak: parseInt(jarak),
                                                        //     // finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     // jalur: 'zonasi',
                                                        //     // jalurNama: 'Zonasi',
                                                        //     // status_uprove: false,
                                                        //     // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,


                                                        // });

                                                        // // MASUK KE SEKOLAH 2
                                                        // firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     status_uprove: false,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     uid: useraktif.uid,

                                                        // });

                                                        // firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     smpPil: $scope.namaSekolah,
                                                        //     smpPilZonasi: smpPilZonasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // firebase.database().ref('siswa/' + useraktif.uid).update({
                                                        //     status_daftar: true,
                                                        //     status_daftarZonasi: true,
                                                        //     status_daftarJalur: true,
                                                        //     dokumenAfirmasi: dokumenAfirmasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // // MASUK KE SEKOLAH 2


                                                        // // File 
                                                        // var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        // var storageDok = $firebaseStorage(storageRefDok);
                                                        // var fileDok = document.getElementById("inputberkas").files[0];

                                                        // var metadata = {
                                                        //     contentType: fileDok.type
                                                        // }
                                                        // //Upload File
                                                        // ////console.log(file);
                                                        // var uploadTask = storageDok.$put(fileDok);
                                                        // $ionicLoading.show();

                                                        // uploadTask.$complete(function (snapshot) {
                                                        //     //console.log(snapshot);
                                                        //     storageRefDok.getDownloadURL().then(function (url) {
                                                        //         //console.log(url);
                                                        //         var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                        //         refAddFoto.set({
                                                        //             "URL": url,
                                                        //             "namaFile": snapshot.metadata.name
                                                        //         }).then(function (response) {
                                                        //             $ionicLoading.hide();
                                                        //             ////console.log(response);
                                                        //             return true;
                                                        //         }).then(function (error) {
                                                        //             ////console.log(error);
                                                        //         });
                                                        //     }).catch(function (error) {
                                                        //         // Handle any errors
                                                        //     });
                                                        // })
                                                        // $ionicLoading.hide();
                                                        // // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            statusKK: $scope.formData.statusKK,
                                                            uid: useraktif.uid,

                                                            // status_uprove: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,

                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            id_sd: $scope.formData.id_sd,
                                                            // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            status_uprove: false,
                                                            statusKK: $scope.formData.statusKK,
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,

                                                        });

                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            dokumenAfirmasi: dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        // MASUK KE SEKOLAH 2


                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("inputberkas").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')

                                                    }

                                                });
                                                // $state.go('pendaftaran_ppdb');
                                            }
                                        }
                                    })

                                }

                                // DAFTAR PERPINDAHAN
                                var pilihan = "";
                                $scope.pilihanberkaspindahan = function () {
                                    pilihan = $scope.form.jenisDoc;
                                    //console.log(pilihan);

                                    if (pilihan == 'Surat Penugasan Ortu / Wali') {
                                        $scope.statusPerpindahan = true;
                                    } else {
                                        $scope.statusPerpindahan = false;
                                    }
                                }

                                $scope.daftarperpindahan = function () {
                                    const swalDaftarPerpindahan = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalDaftarPerpindahan.fire({
                                        title: 'Daftar Jalur Perpindahan ',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin mendaftar di jalur Perpindahan  ?',
                                        showCancelButton: true,
                                        confirmButtonText: 'Daftar',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            if ($scope.statusdaftarZonasi == true) {
                                                // window.alert('SUDAH DAFTAR ZONASI SEBELUMNYA')
                                                $ionicLoading.show();
                                                $("#modal_simpan_perpindahan").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                var umur = $scope.formData.umur;
                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);
                                                var sekolahPerpindahan = $scope.form.idSekolahPerpindahan;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPerpindahan);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    //console.log($scope.namaSekolah);
                                                    //console.log(sekolahPerpindahan);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahPerpindahan == sekolahZonasi) {
                                                        $ionicLoading.hide();
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        })
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahPerpindahan + '/perpindahan/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                            uid: useraktif.uid,


                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            id_sd: $scope.formData.id_sd,
                                                            // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            // status_uprove: false,
                                                            statusKK: $scope.formData.statusKK,
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,

                                                        });

                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur: 'perpindahan',
                                                            jalurNama: 'Perpindahan',
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            // dokumenAfirmasi : dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("berkasPerpindahan").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPerpindahan')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')
                                                    }

                                                });
                                                $state.go('pendaftaran_ppdb');
                                            } else {
                                                $ionicLoading.show();
                                                $("#modal_simpan_perpindahan").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                var umur = $scope.formData.umur;
                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);
                                                var sekolahPerpindahan = $scope.form.idSekolahPerpindahan;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPerpindahan);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    //console.log($scope.namaSekolah);
                                                    //console.log(sekolahPerpindahan);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahPerpindahan == sekolahZonasi) {
                                                        // Swal.fire({
                                                        //     icon: 'warning',
                                                        //     title: 'Perhatian',
                                                        //     text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        // })
                                                        const swalDaftarPerpindahanyes = Swal.mixin({
                                                            customClass: {
                                                                confirmButton: 'btn btn-primary ms-2',
                                                                cancelButton: 'btn btn-outline-secondary'
                                                            },
                                                            buttonsStyling: false
                                                        })
                                                        swalDaftarPerpindahanyes.fire({
                                                            title: 'Perhatian',
                                                            icon: 'warning',
                                                            text: 'Sekolah yang anda pilih berada di daerah zonasi anda, setelah klik Lanjutkan , data anda hanya terdaftar sebagai peserta Jalur Perpindahan Tugas Orang Tua',
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Lanjutkan',
                                                            reverseButtons: true
                                                        }).then((result) => {
                                                            // MASUK KE SEKOLAH 1
                                                            firebase.database().ref('smp/' + sekolahPerpindahan + '/perpindahan/' + useraktif.uid).update({
                                                                nama: $scope.formData.nama,
                                                                nisn: $scope.formData.nisn,
                                                                sekolah_asal: $scope.formData.sekolah_asal,
                                                                jarak: parseInt(jarak),
                                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                finalPoin: point,
                                                                //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                // status_uprove: false,
                                                                status_uprove2: false,
                                                                // jalur: 'zonasi',
                                                                // jalurNama: 'Zonasi',
                                                                // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                jalur2: 'perpindahan',
                                                                jalurNama2: 'Perpindahan',
                                                                no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                                sekolahJalur: $scope.namaSekolah,
                                                                sekolahJalurId: sekolahPerpindahan,
                                                                uid: useraktif.uid,


                                                            });

                                                            firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                nama: $scope.formData.nama,
                                                                nisn: $scope.formData.nisn,
                                                                smpPil: $scope.namaSekolah,
                                                                smpPilZonasi: smpPilZonasi,
                                                                jarak: parseInt(jarak),
                                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                finalPoin: point,
                                                                //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                // jalur: 'zonasi',
                                                                // jalurNama: 'Zonasi',
                                                                // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                jalur: 'perpindahan',
                                                                jalurNama: 'Perpindahan',
                                                                // status_uprove: false,
                                                                status_uprove2: false,
                                                                no_pendaftaran: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                                uid: useraktif.uid,
                                                            });

                                                            firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                status_daftar: true,
                                                                // status_daftarZonasi: true,
                                                                status_daftarJalur: true,
                                                                // dokumenAfirmasi : dokumenAfirmasi,
                                                                jarak: parseInt(jarak),
                                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                finalPoin: point,
                                                                //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                // jalur: 'zonasi',
                                                                // jalurNama: 'Zonasi',
                                                                // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                jalur2: 'perpindahan',
                                                                jalurNama2: 'Perpindahan',
                                                                // status_uprove: false,
                                                                status_uprove2: false,
                                                                no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                                sekolahJalur: $scope.namaSekolah,
                                                                sekolahJalurId: sekolahPerpindahan,
                                                            });

                                                            // MASUK KE SEKOLAH 2
                                                            // File 
                                                            var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                            var storageDok = $firebaseStorage(storageRefDok);
                                                            var fileDok = document.getElementById("berkasPerpindahan").files[0];

                                                            var metadata = {
                                                                contentType: fileDok.type
                                                            }
                                                            //Upload File
                                                            ////console.log(file);
                                                            var uploadTask = storageDok.$put(fileDok);
                                                            $ionicLoading.show();

                                                            uploadTask.$complete(function (snapshot) {
                                                                //console.log(snapshot);
                                                                storageRefDok.getDownloadURL().then(function (url) {
                                                                    //console.log(url);
                                                                    var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPerpindahan')
                                                                    refAddFoto.set({
                                                                        "URL": url,
                                                                        "namaFile": snapshot.metadata.name
                                                                    }).then(function (response) {
                                                                        $ionicLoading.hide();
                                                                        ////console.log(response);
                                                                        return true;
                                                                    }).then(function (error) {
                                                                        ////console.log(error);
                                                                    });
                                                                }).catch(function (error) {
                                                                    // Handle any errors
                                                                });
                                                            })
                                                            $ionicLoading.hide();
                                                            // window.alert('Terdaftar')
                                                            // $("#modal_simpan_zonasi").modal('hide')
                                                            // window.alert('Terdaftar')
                                                            $("#modal_simpan_zonasi").modal('hide')
                                                        })
                                                        $ionicLoading.hide();
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahPerpindahan + '/perpindahan/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                            uid: useraktif.uid,


                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            id_sd: $scope.formData.id_sd,
                                                            // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            status_uprove: false,
                                                            statusKK: $scope.formData.statusKK,
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,

                                                        });

                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur: 'perpindahan',
                                                            jalurNama: 'Perpindahan',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            // dokumenAfirmasi : dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("berkasPerpindahan").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPerpindahan')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')
                                                    }

                                                });
                                                $state.go('pendaftaran_ppdb');
                                            }
                                        }
                                    })
                                }
                                // DAFTAR PRESTASI
                                var pilihan = "";
                                $scope.pilihanjenisprestasi = function () {
                                    pilihan = $scope.form.jenisPrestasi;
                                    console.log(pilihan);

                                    if (pilihan == 'keterampilan') {
                                        $scope.statusRaport = false;
                                        $scope.statusKeterampilan = true;
                                    } else if (pilihan == 'rapor') {
                                        $scope.statusRaport = true;
                                        $scope.statusKeterampilan = false;
                                    } else {
                                        $scope.statusRaport = false;
                                        $scope.statusKeterampilan = false;
                                    }
                                }
                                $scope.daftarprestasi = function () {
                                    console.log('TEKAN DAFTAR PRESTASI')
                                    var jenisPrestasi = document.getElementById("jenisPrestasi").value;
                                    // console.log(jenisPrestasi);
                                    if (jenisPrestasi != '') {
                                        if ($scope.statusdaftarZonasi == true) {
                                            console.log('SUDAH DAFTAR ZONASI')
                                            if (jenisPrestasi == 'rapor') {
                                                console.log('JALUR RAPORT');
                                                var suratRapor = document.getElementById("berkasraport").value;
                                                var peringkatRapor = document.getElementById("peringkatraport").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                if (suratRapor != '' && peringkatRapor != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });


                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        // //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        // jalur: 'zonasi',
                                                                        // jalurNama: 'Zonasi',
                                                                        // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Jalur Nilai Rapor',
                                                                        peringkatRapor: peringkatRapor,
                                                                        akumulasiRaporPrestasi: akumulasiRapor


                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasraport").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'keterampilan') {
                                                console.log('JALUR KETERAMPILAN');
                                                var deskripsiKeterampilan = document.getElementById("deskripsi").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var berkasketerampilan = document.getElementById("berkasketerampilan").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                console.log(deskripsiKeterampilan);
                                                console.log(akumulasiRapor);
                                                console.log(berkasketerampilan);
                                                console.log(sekolahPrestasi);

                                                if (berkasketerampilan != '' && deskripsiKeterampilan != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {

                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        // //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Keterampilan Lain',
                                                                        deskripsiKeterampilan: deskripsiKeterampilan,
                                                                        akumulasiRaporPrestasi: akumulasiRapor


                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasketerampilan").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'akademik') {
                                                console.log('JALUR AKADEMIK');
                                                var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                var cabang = document.getElementById("cabangKompetisi").value;
                                                var peringkat = document.getElementById("juaraPrestasi").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;
                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);
                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        // //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,


                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })

                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }
                                            } else {
                                                const swalDaftarPrestasi = Swal.mixin({
                                                    customClass: {
                                                        confirmButton: 'btn btn-primary ms-2',
                                                        cancelButton: 'btn btn-outline-secondary'
                                                    },
                                                    buttonsStyling: false
                                                })
                                                swalDaftarPrestasi.fire({
                                                    title: 'Daftar Jalur Prestasi ',
                                                    icon: 'warning',
                                                    text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Daftar',
                                                    reverseButtons: true
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        console.log('NON AKADEMIK');
                                                        var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                        var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                        var cabang = document.getElementById("cabangKompetisi").value;
                                                        var peringkat = document.getElementById("juaraPrestasi").value;
                                                        var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                        var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                        var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                        if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: ' NON AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,


                                                                    });
                                                                    // MASUK KE SEKOLAH 2
                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Pastikan form sudah terisi lengkap',
                                                                focusConfirm: false
                                                            })
                                                        }


                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('BELUM DAFTAR ZONASI')
                                            if (jenisPrestasi == 'rapor') {
                                                console.log('JALUR RAPORT');
                                                var suratRapor = document.getElementById("berkasraport").value;
                                                var peringkatRapor = document.getElementById("peringkatraport").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                if (suratRapor != '' && peringkatRapor != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });


                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Jalur Nilai Rapor',
                                                                        peringkatRapor: peringkatRapor,
                                                                        akumulasiRaporPrestasi: akumulasiRapor


                                                                    });


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasraport").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'keterampilan') {
                                                console.log('JALUR KETERAMPILAN');
                                                var deskripsiKeterampilan = document.getElementById("deskripsi").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var berkasketerampilan = document.getElementById("berkasketerampilan").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                console.log(deskripsiKeterampilan);
                                                console.log(akumulasiRapor);
                                                console.log(berkasketerampilan);
                                                console.log(sekolahPrestasi);

                                                if (berkasketerampilan != '' && deskripsiKeterampilan != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {

                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Keterampilan Lain',
                                                                        deskripsiKeterampilan: deskripsiKeterampilan,
                                                                        akumulasiRaporPrestasi: akumulasiRapor
                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasketerampilan").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'akademik') {
                                                const swalDaftarPrestasi = Swal.mixin({
                                                    customClass: {
                                                        confirmButton: 'btn btn-primary ms-2',
                                                        cancelButton: 'btn btn-outline-secondary'
                                                    },
                                                    buttonsStyling: false
                                                })
                                                swalDaftarPrestasi.fire({
                                                    title: 'Daftar Jalur Prestasi ',
                                                    icon: 'warning',
                                                    text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Daftar',
                                                    reverseButtons: true
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        console.log('JALUR AKADEMIK');
                                                        var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                        var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                        var cabang = document.getElementById("cabangKompetisi").value;
                                                        var peringkat = document.getElementById("juaraPrestasi").value;
                                                        var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                        var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                        var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                        if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                            $ionicLoading.show();

                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,
                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Pastikan form sudah terisi lengkap',
                                                                focusConfirm: false
                                                            })
                                                        }
                                                    }
                                                })
                                            } else {
                                                const swalDaftarPrestasi = Swal.mixin({
                                                    customClass: {
                                                        confirmButton: 'btn btn-primary ms-2',
                                                        cancelButton: 'btn btn-outline-secondary'
                                                    },
                                                    buttonsStyling: false
                                                })
                                                swalDaftarPrestasi.fire({
                                                    title: 'Daftar Jalur Prestasi ',
                                                    icon: 'warning',
                                                    text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Daftar',
                                                    reverseButtons: true
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        console.log('NON AKADEMIK');
                                                        var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                        var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                        var cabang = document.getElementById("cabangKompetisi").value;
                                                        var peringkat = document.getElementById("juaraPrestasi").value;
                                                        var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                        var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                        var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                        if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: ' NON AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,


                                                                    });
                                                                    // MASUK KE SEKOLAH 2
                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Pastikan form sudah terisi lengkap',
                                                                focusConfirm: false
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    } else {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Jenis Prestasi Tidak Boleh Kosong',
                                            focusConfirm: false
                                        })
                                    }
                                }
                            })
                        });
                    } else {
                        //   window.alert("ID KOSONG");
                    }

                })
                //CEK KELENGKAPAN SKL
                var data_skl = firebase.database().ref('siswa/' + useraktif.uid);
                data_skl.on("value", function (snapshot) {
                    $scope.statusSKL = snapshot.val().status_skl;
                })

                var berkas_skl = firebase.database().ref('siswa/' + useraktif.uid + '/file/URL');
                berkas_skl.on("value", function (snapshot) {
                    ////console.log(snapshot.val());
                    $scope.statusBerkas = snapshot.val();
                    if (snapshot.val() != null) {
                        console.log('ADA BERKAS SKL');
                    }
                    else {
                        console.log('TIDAK BERKAS ADA SKL')
                    }
                })

            }
            else {
                console.log('TIDAK AKTIF')
            }

        });
    }])


    .controller('pendaftaranKhususCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-alterPass-danger").hide();

        // CHECK KONDISI PENGATURAN

        let cekBukaPendaftaran = firebase.database().ref('pengaturan').child('bukaPendaftaran');
        cekBukaPendaftaran.on('value', (dataSnapShot) => {
            $scope.cekPendaftaran = {
                // "nip": dataSnapShot.val().nip,
                "aktif": dataSnapShot.val().aktif,
            };
            console.log($scope.cekPendaftaran.aktif);
        })
        var cekBukaJalurZonasi = firebase.database().ref('pengaturan').child('buka_jalurZonasi');
        cekBukaJalurZonasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurZonasi = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurZonasi == false) {
                $('#div-jalur-zonasi').show();

            } else {
                $('#div-jalur-zonasi').hide();
            }
        })
        var cekBukaJalurAfirmasi = firebase.database().ref('pengaturan').child('buka_jalurAfirmasi');
        cekBukaJalurAfirmasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurAfirmasi = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurAfirmasi == false) {
                $('#div-jalur-afirmasi').show();

            } else {
                $('#div-jalur-afirmasi').hide();
            }
        })

        var cekBukaJalurPilihan = firebase.database().ref('pengaturan').child('buka_jalurPilihan');
        cekBukaJalurPilihan.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPilihan = dataSnapShot.val().aktif;
            console.log('JALUR PILIHAN ' + $scope.cekBukaJalurPilihan)
        })
        var cekBukaJalurPerpindahan = firebase.database().ref('pengaturan').child('buka_jalurPerpindahan');
        cekBukaJalurPerpindahan.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPerpindahan = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurPerpindahan == false) {
                $('#div-jalur-perpindahan').show();

            } else {
                $('#div-jalur-perpindahan').hide();
            }
        })
        var cekBukaJalurPrestasi = firebase.database().ref('pengaturan').child('buka_jalurPrestasi');
        cekBukaJalurPrestasi.on('value', (dataSnapShot) => {
            $scope.cekBukaJalurPrestasi = dataSnapShot.val().aktif;
            if ($scope.cekBukaJalurPrestasi == false) {
                $('#div-jalur-prestasi').show();

            } else {
                $('#div-jalur-prestasi').hide();
            }
        })

        // FUNCTION TOMBOL - TOMBOL
        $scope.myZone = function () {


            var map_zonasi
            map_zonasi = new google.maps.Map(document.getElementById('map_zonasi'), {
                center: {
                    lat: -7.960996,
                    lng: 112.618634
                },
                zoom: 16
            });
            var directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map_zonasi);
            var directionsService = new google.maps.DirectionsService();

            var cekSekolahTujuan = firebase.database().ref('siswa/' + firebase.auth().currentUser.uid);
            cekSekolahTujuan.on("value", function (snapshot) {
                ////console.log(snapshot.val().status_skl);
                $scope.statusSKL = snapshot.val().status_skl;
                var startAddress = snapshot.val().alamatzonasi;
                var endAddress = snapshot.val().sekolahZonasiAlamat;
                var request = {
                    origin: startAddress,
                    destination: endAddress,
                    travelMode: 'DRIVING'
                };
                directionsService.route(request, function (result, status) {
                    if (status == 'OK') {
                        directionsDisplay.setDirections(result);

                        //console.log(result.routes[0].legs[0].distance.text);
                        //console.log(result.routes[0].legs[0].distance.value);
                        firebase.database().ref('siswa/' + firebase.auth().currentUser.uid).update({
                            jarak: parseInt(result.routes[0].legs[0].distance.value),
                        }).then(function () {
                            // location.reload();
                        });

                    } else {
                        // window.alert('Petunjuk arah gagal dimuat, masukkan alamat yang benar!')
                        // $('#modal_alert_map_arah').modal();
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Alamat gagal dimuat, masukan alamat yang benar',
                            focusConfirm: false
                        })
                    }
                });

            })

            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (x.style.display === "block") {
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
                c.style.display = "none";
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
        }
        $scope.myZoneSwasta = function () {

            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (x.style.display === "block") {
                // x.style.display = "none";
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "block";
                y.style.display = "none";
                z.style.display = "none";
                c.style.display = "none";
                $('#btn-jalur-zonasi').addClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
        }
        $scope.myAfirmation = function () {
            console.log('KLIK AFIRMASI')
            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (y.style.display === "block") {
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').addClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "none";
                y.style.display = "block";
                z.style.display = "none";
                c.style.display = "none";
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').addClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
        }
        $scope.myPrestasi = function () {
            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (z.style.display === "block") {
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').addClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }
            else {
                x.style.display = "none";
                y.style.display = "none";
                z.style.display = "block";
                c.style.display = "none";
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').addClass('on');
                $('#btn-jalur-pindahan').removeClass('on');
            }

        }
        $scope.myPindahan = function () {
            var x = document.getElementById("zonasi");
            var y = document.getElementById("afirmasi");
            var z = document.getElementById("prestasi");
            var c = document.getElementById("pindahan");
            if (c.style.display === "block") {
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').addClass('on');
            }
            else {
                x.style.display = "none";
                y.style.display = "none";
                z.style.display = "none";
                c.style.display = "block";
                $('#btn-jalur-zonasi').removeClass('on');
                $('#btn-jalur-afirmasi').removeClass('on');
                $('#btn-jalur-prestasi').removeClass('on');
                $('#btn-jalur-pindahan').addClass('on');
            }
        }
        $scope.alter_pen = function () {
            var alter_pass = document.getElementById('alter_pass').value;
            console.log(alter_pass);
            if (alter_pass == "hesoyam") {
                $('#modal_alter').modal('hide');
                $state.go('pendaftaran_alter');
            } else {
                $("#alert-alterPass-danger").show(function () {
                    $("#alert-alterPass-danger").fadeTo(2000, 500).slideUp(500, function () {
                        $("#alert-alterPass-danger").slideUp(500);
                    });
                });
            }
        }
        $scope.alertDashboardUser = function () {
            Swal.fire({
                icon: 'question',
                title: 'Selamat Datang',
                html:
                    '<div class="text-justify">Berikut Penjelasan singkat perihal <b>Tata Cara Pendaftaran </b> di sistem <b>e-PPDB</b>.' +
                    '<p>Proses Pendaftaran di bagi menjadi 2 Tahap</p> ' +
                    '<ol> <li> 1. Mengisi Data Diri & Upload Berkas</li>' +
                    '<li> 2. Pemilihan Jalur  </ol>' +
                    'Setelah Pengguna Memilih Jalur pada sekolah pilihan, data pendaftaran akan langsung masuk ke proses pemeriksaan oleh sekolah terkait. <br><br> ' +
                    'Setelah status data pendaftaran pengguna dinyatakan <b>SUDAH VALID</b>, proses pendaftaran pengguna sudah selesai. <br><br>' +
                    'Selanjutnya data pendaftaran pengguna akan di Ranking di Sekolah Terkait, jika lolos maka pengguna akan dapat dinyatakan terdaftar sebagai siswa di Sekolah Pilihan. <br><br>' +
                    'Jika Gagal Pengguna dapat mencoba mendaftar kembali di Jalur Lain.' +
                    'Sekian Penjelasan singkat perihal Alur Pendaftaran di Sistem <b>e-PPDB</b></div>',
                showCancelButton: true,
                confirmButtonText: 'Ok',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    window.localStorage.alertDashboardUser = "on";
                }
            })
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
                    $state.go('welcome');
                }
            })

        }
        $scope.printJalur = function () {
            var element = document.getElementById("buktidaftarZonasi");
            element.classList.add("no-print");
            var element2 = document.getElementById("buktidaftarJalur");
            element2.classList.remove("no-print");
            print();
        }
        $scope.printZonasi = function () {
            var element = document.getElementById("buktidaftarJalur");
            console.log(element);
            if (element != null) {
                element.classList.add("no-print");
                var element2 = document.getElementById("buktidaftarZonasi");
                element2.classList.remove("no-print");

                print();
            } else {
                print();
            }

        }

        $scope.checkScreen = function () {
            if ($(window).width() < 1200) {
                $('#badge-belum, #badge-sudah').addClass('btn-sm')
            }
            else {
                $('#badge-belum, #badge-sudah').removeClass('btn-sm')
            }
        }
        $(window).resize(function () {
            $scope.checkScreen();
        });
        $scope.checkScreen();

        $scope.nightActive = function () {
            if ($("#nightmode").hasClass("night-active")) {
                $("#wrapper, .navbar, #nav-flex, .accordion-item").addClass('bg-night').removeClass('bg-light');
                $(".accordion-button").addClass('accordion-button-dark bg-night text-light').removeClass('bg-light');
                $("#menu-toggle, .nav-link, .far.fa-envelope").addClass('text-light');
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
                $("#menu-toggle, .nav-link, .far.fa-envelope").removeClass('text-light');
                $(".fa-question-circle, span.fw-light,thead,div.card-body, tbody,#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $(".modal-body, .modal-header").addClass('text-light').removeClass('text-dark');
                $("#icon-night ").addClass('far fa-sun').removeClass('fa fa-moon text-light');
                $("#page-header, .fs-5").removeClass('text-light').addClass('text-dark');
                $("#small-header, footer, p.fw-bold").removeClass('text-light').addClass('text-muted');

                $("#jadwal, #chart-s, .card-header").removeClass('bg-night-side');
                $("li.montserrat").removeClass('bg-night-side text-light');
                $(".card").removeClass('bg-night-side card-border-night').addClass('card-border-light');
                // $(" #badge-belum ").removeClass('btn-danger').addClass('btn-outline-danger');
                // $(" #badge-sudah ").removeClass('btn-success').addClass('btn-outline-success');
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
        $scope.dashboard = function () {
            $state.go('dashboard');
        }
        $scope.pengumumanUser = function () {
            $state.go('pengumuman');
        }
        $scope.pengaturanUser = function () {
            $state.go('pengaturanUser');
        }
        $scope.pendaftaran_kembali = function () {
            $ionicLoading.show();
            $state.go('pendaftaran_kembali');
        }

        // MAIN FUNCTION
        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var start = document.getElementById('daftar_alamatzonasi');
                new google.maps.places.SearchBox(start);
                var useraktif = firebase.auth().currentUser;
                console.log(useraktif.uid);
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('siswa/' + useraktif.uid);
                pengguna.on("value", function (snapshot) {
                    // console.log(snapshot.val())

                    
                    if (snapshot.val() != null) {

                        snapshot.forEach(function (data) {
                            let firebaseRefKey = firebase.database().ref('siswa/' + useraktif.uid);
                            firebaseRefKey.on('value', (dataSnapShot) => {

                                $scope.formData = {
                                    "nisn": dataSnapShot.val().nisn,
                                    "nama": dataSnapShot.val().nama,
                                    "jenis_kelamin": dataSnapShot.val().jenis_kelamin,

                                    "nik": dataSnapShot.val().nik,
                                    "id_sd": dataSnapShot.val().id_sd,
                                    "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                    "alamat": dataSnapShot.val().alamat,
                                    "tempat_lahir": dataSnapShot.val().tempat_lahir,
                                    "tanggal_lahir": dataSnapShot.val().tanggal_lahir,
                                    "idDesa": dataSnapShot.val().idDesa,
                                    "no_pendaftaran": dataSnapShot.val().no_pendaftaran,
                                    "no_pendaftaran2": dataSnapShot.val().no_pendaftaran2,
                                    "sekolahZonasi": dataSnapShot.val().sekolahZonasi,
                                    "sekolahJalur": dataSnapShot.val().sekolahJalur,
                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "jarak": dataSnapShot.val().jarak,
                                    "jalur": dataSnapShot.val().jalur,
                                    "jalurNama": dataSnapShot.val().jalurNama,
                                    "jalur2": dataSnapShot.val().jalur2,
                                    "jalurNama2": dataSnapShot.val().jalurNama2,
                                    "noKK": dataSnapShot.val().noKK,
                                    // "nomor_skl": dataSnapShot.val().nomor_skl,
                                    // "nilai_skl": dataSnapShot.val().nilai_skl,


                                    "idKecamatan": dataSnapShot.val().idKecamatan,
                                    "namaKecamatan": dataSnapShot.val().namaKecamatan,
                                    "idDesa": dataSnapShot.val().idDesa,
                                    "namaDesa": dataSnapShot.val().namaDesa,
                                    "alamatzonasi": dataSnapShot.val().alamatzonasi,
                                    "koreksi": dataSnapShot.val().koreksi,
                                    "umur": dataSnapShot.val().umur,
                                    "umur_display": dataSnapShot.val().umur_display,
                                    "statusKK": dataSnapShot.val().statusKK,

                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "sekolahZonasi": dataSnapShot.val().sekolahZonasi,

                                };
                                $scope.CheckPhoto = dataSnapShot.val().jenis_kelamin;
                                $scope.statusvalidasi = dataSnapShot.val().status_uprove;
                                $scope.statusvalidasi2 = dataSnapShot.val().status_uprove2;
                                $scope.statusdaftar = dataSnapShot.val().status_daftar;
                                $scope.statusdaftarZonasi = dataSnapShot.val().status_daftarZonasi;
                                $scope.statusdaftarJalur = dataSnapShot.val().status_daftarJalur;
                                $scope.statusdaftarSwasta = dataSnapShot.val().pilihSwasta;

                                $scope.sklhNama1 = dataSnapShot.val().sekolahZonasi;
                                $scope.sklhId1 = dataSnapShot.val().idsekolah_zonasi;
                                $scope.sklhAlamat1 = dataSnapShot.val().sekolahZonasiAlamat;

                                // console.log( $scope.sklhAlamat1 );


                                // TEMPAT DI PILIH DESA

                                $ionicLoading.hide();

                                $scope.form = {
                                    "idKecamatan": $scope.formData.idKecamatan,
                                    "idDesa": $scope.formData.idDesa,
                                }

                                var refKecamatan = firebase.database().ref("kecamatan");
                                $scope.dataKecamatan = $firebaseArray(refKecamatan);
                                var refDesa = firebase.database().ref("desa");
                                $scope.dataDesa = $firebaseArray(refDesa);

                                var idDesa = $scope.form.idDesa;
                                $scope.idDesa = $scope.form.idDesa;
                                //Get Nama Kecamatan
                                var namaDesa = firebase.database().ref("desa").orderByChild("id_desa").equalTo(idDesa);
                                var listNamaDesa = $firebaseArray(namaDesa);
                                listNamaDesa.$loaded().then(function (response) {
                                    $scope.formData.namaDesa = response[0].nama_desa;
                                    $scope.formData.idDesa = response[0].id_desa;

                                    // $scope.sklhNama1 = response[0].nama_smp;
                                    // $scope.sklhId1 = response[0].id_smp;
                                    // $scope.sklhAlamat1 = response[0].alamat_smp;


                                });

                                var refSekolah = firebase.database().ref("sekolah").orderByChild("jenjang").equalTo('SMP');;
                                $scope.dataSekolah = $firebaseArray(refSekolah);


                                var refSekolahSwasta = firebase.database().ref("sekolahSwasta").orderByChild("jenjang").equalTo('SMP');
                                $scope.dataSekolahSwasta = $firebaseArray(refSekolahSwasta);

                                $scope.getIdKecamatan = function () {
                                    var idKecamatan = $scope.form.idKecamatan;
                                    $scope.idKecamatan = $scope.form.idKecamatan;
                                    //Get Nama Kecamatan
                                    var namaKecamatan = firebase.database().ref("kecamatan").orderByChild("id_kecamatan").equalTo(idKecamatan);
                                    var listNamaKecamatan = $firebaseArray(namaKecamatan);
                                    listNamaKecamatan.$loaded().then(function (response) {
                                        $scope.formData.namaKecamatan = response[0].nama_kecamatan;
                                        $scope.formData.idKecamatan = response[0].id_kecamatan;

                                    });

                                    // var refDesa = firebase.database().ref("desa").orderByChild("id_kecamatan").equalTo(idKecamatan);
                                    // $scope.dataDesa = $firebaseArray(refDesa);
                                }

                                // KLIK BERIKUTNYA
                                $scope.simpan1 = function () {

                                    // $("#modal_simpan").modal('hide')
                                    var alamatzonasi = document.getElementById("daftar_alamatzonasi").value;
                                    var noKK = document.getElementById("daftar_noKK").value;
                                    var statusKK = document.getElementById("daftar_statusKK").value;
                                    var daftarSwasta = document.getElementById("daftar_swastaOnly").value;
                                    var swasta;
                                    // FILE Kartu Keluarga
                                    var storageRef = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Skl');
                                    var storage = $firebaseStorage(storageRef);
                                    var file = document.querySelector("#inputSkl").files[0];

                                    if (noKK != '') {

                                        if (file != undefined) {
                                            const swalDaftarZonasi = Swal.mixin({
                                                customClass: {
                                                    confirmButton: 'btn btn-primary ms-2',
                                                    cancelButton: 'btn btn-outline-secondary'
                                                },
                                                buttonsStyling: false
                                            })
                                            swalDaftarZonasi.fire({
                                                title: 'Perhatian',
                                                icon: 'warning',
                                                text: 'Pastikan data yang dimasukan sudah benar. Klik Lanjut untuk melanjutkan pendaftaran',
                                                showCancelButton: true,
                                                confirmButtonText: 'Lanjut',
                                                reverseButtons: true
                                            }).then((result) => {
                                                if (result.isConfirmed) {

                                                    $ionicLoading.show();

                                                    var metadata = {
                                                        contentType: file.type
                                                    }
                                                    //Upload File
                                                    var uploadTask = storage.$put(file);
                                                    uploadTask.$complete(function (snapshot) {
                                                        storageRef.getDownloadURL().then(function (url) {
                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/file');
                                                            refAddFoto.set({
                                                                "URL": url,
                                                                "namaFile": snapshot.metadata.name
                                                            }).then(function (response) {

                                                                if (daftarSwasta == 'true') {
                                                                    swasta = true;
                                                                } else {
                                                                    swasta = false
                                                                }
                                                                // MENDAFTAR SEKOLAH SWASTA
                                                                if (swasta == true) {
                                                                    console.log('PILIHAN SEKOLAH SWASTA')

                                                                    if (alamatzonasi.length > 0 && noKK.length > 0 && statusKK.length > 0) {
                                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                            status_daftar: false,
                                                                            status_daftarZonasi: false,
                                                                            status_daftarJalur: false,
                                                                            status_skl: true,
                                                                            status_terima: false,
                                                                            status_uprove: false,
                                                                            idKecamatan: $scope.formData.idKecamatan,
                                                                            namaKecamatan: $scope.formData.namaKecamatan,
                                                                            idDesa: $scope.formData.idDesa,
                                                                            namaDesa: $scope.formData.namaDesa,
                                                                            koreksi: null,
                                                                            sekolahZonasiId: '',
                                                                            sekolahZonasi: '',
                                                                            sekolahZonasiAlamat: '',
                                                                            alamatzonasi: alamatzonasi,
                                                                            noKK: noKK,
                                                                            statusKK: statusKK,
                                                                            kombinasiZonasi: $scope.formData.idDesa + '-' + $scope.formData.id_sd,
                                                                            pilihSwasta: true,
                                                                        }).then(function () {
                                                                            $ionicLoading.hide();
                                                                        });
                                                                    } else {
                                                                        $ionicLoading.hide();
                                                                        Swal.fire({
                                                                            icon: 'warning',
                                                                            title: 'Perhatian',
                                                                            text: 'Data Tidak Boleh Kosong',
                                                                            focusConfirm: false
                                                                        })

                                                                    }

                                                                } else {



                                                                    // MENDAFTAR SEKOLAH NEGERI
                                                                    console.log('PILIHAN SEKOLAH NEGERI')
                                                                    console.log("JALUR DESA");
                                                                    console.log($scope.sklhAlamat1);

                                                                    if (alamatzonasi.length > 0 && noKK.length > 0 && statusKK.length > 0) {
                                                                        console.log('HITUNG JARAK');

                                                                        console.log('1 Sekolah Terdekat');
                                                                        var map;
                                                                        map = new google.maps.Map(document.getElementById('map'), {
                                                                            center: {
                                                                                lat: -7.960996,
                                                                                lng: 112.618634
                                                                            },
                                                                            zoom: 16
                                                                        });

                                                                        var directionsDisplay = new google.maps.DirectionsRenderer();
                                                                        directionsDisplay.setMap(map);
                                                                        var start = document.getElementById('daftar_alamatzonasi');
                                                                        console.log('START' + start);
                                                                        var searchStart = new google.maps.places.SearchBox(start);

                                                                        var directionsService = new google.maps.DirectionsService();

                                                                        var cekSekolahTujuan = firebase.database().ref('siswa/' + useraktif.uid);
                                                                        cekSekolahTujuan.on("value", function (snapshot) {

                                                                            $scope.statusSKL = snapshot.val().status_skl;
                                                                            var startAddress = snapshot.val().alamatzonasi;
                                                                            var endAddress1 = $scope.sklhAlamat1;
                                                                            var tempjarak1;

                                                                            // HITUNG JARAK 1
                                                                            var request1 = {
                                                                                origin: startAddress,
                                                                                destination: endAddress1,
                                                                                travelMode: 'DRIVING'
                                                                            };


                                                                            directionsService.route(request1, function (result, status) {
                                                                                if (status == 'OK') {
                                                                                    directionsDisplay.setDirections(result);
                                                                                    console.log(result.routes[0].legs[0].distance.text);
                                                                                    console.log(result.routes[0].legs[0].distance.value);

                                                                                    tempjarak1 = parseInt(result.routes[0].legs[0].distance.value)

                                                                                    if (tempjarak1 >= parseInt(25000)) {
                                                                                        Swal.fire({
                                                                                            icon: 'error',
                                                                                            title: 'Error',
                                                                                            text: 'Kordinat tempat tinggal anda lebih dari 25km ke sekolah zonasi, harap hubungi admin sekolah untuk perbaikan data',
                                                                                            focusConfirm: false
                                                                                        })
                                                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                                            status_skl: false,
                                                                                        })
                                                                                    }

                                                                                } else {
                                                                                    Swal.fire({
                                                                                        icon: 'error',
                                                                                        title: 'Error',
                                                                                        text: 'Alamat gagal dimuat, masukan alamat yang benar',
                                                                                        focusConfirm: false
                                                                                    })
                                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                                        status_skl: false,
                                                                                    })
                                                                                }
                                                                            }).then(function () {

                                                                                console.log('JARAK 1 ' + tempjarak1 + ' ' + $scope.sklhNama1 + ' ' + $scope.sklhId1);

                                                                                const pilihJarak = [tempjarak1];
                                                                                pilihJarak.sort(function (a, b) { return a - b });

                                                                                console.log(pilihJarak[0]);
                                                                                if (pilihJarak[0] == tempjarak1) {

                                                                                    $scope.sklhId = $scope.sklhId1;
                                                                                    $scope.sklhNama = $scope.sklhNama1;
                                                                                    $scope.sklhAlamat = $scope.sklhAlamat1;

                                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                                        status_daftar: false,
                                                                                        status_daftarZonasi: false,
                                                                                        status_daftarJalur: false,
                                                                                        status_skl: true,
                                                                                        status_terima: false,
                                                                                        status_uprove: false,
                                                                                        idKecamatan: $scope.formData.idKecamatan,
                                                                                        namaKecamatan: $scope.formData.namaKecamatan,
                                                                                        idDesa: $scope.formData.idDesa,
                                                                                        namaDesa: $scope.formData.namaDesa,
                                                                                        alamatzonasi: alamatzonasi,
                                                                                        noKK: noKK,
                                                                                        statusKK: statusKK,
                                                                                        kombinasiZonasi: $scope.formData.idDesa + '-' + $scope.formData.id_sd,

                                                                                        // UPDATE JARAK
                                                                                        jarak: tempjarak1,
                                                                                        sekolahZonasiId: $scope.sklhId,
                                                                                        sekolahZonasi: $scope.sklhNama,
                                                                                        sekolahZonasiAlamat: $scope.sklhAlamat,
                                                                                    }).then(function () {
                                                                                        $state.go('pendaftaran_ppdb');
                                                                                    });

                                                                                } else {
                                                                                    console.log("SALAH");
                                                                                }
                                                                            })
                                                                        })

                                                                        $ionicLoading.hide();

                                                                    } else {
                                                                        $ionicLoading.hide();
                                                                        // window.alert('Data tidak boleh kosong');
                                                                        Swal.fire({
                                                                            icon: 'warning',
                                                                            title: 'Perhatian',
                                                                            text: 'Data tidak boleh kosong',
                                                                            focusConfirm: false
                                                                        })
                                                                        // $('modal_alert_data').modal();
                                                                    }
                                                                }

                                                            }).then(function (error) {
                                                                ////console.log(error);
                                                            });
                                                        }).catch(function (error) {
                                                            // Handle any errors
                                                        });
                                                    })
                                                }
                                                else {
                                                    console.log('Batal')
                                                }

                                            })

                                        } else {
                                            // window.alert('FILE TIDAK BOLEH KOSONG');
                                            $ionicLoading.hide();
                                            Swal.fire({
                                                icon: 'warning',
                                                title: 'Perhatian',
                                                text: 'File tidak boleh kosong',
                                                focusConfirm: false
                                            })
                                        }
                                    } else {
                                        // window.alert('FILE TIDAK BOLEH KOSONG');
                                        $ionicLoading.hide();
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Nomor KK tidak boleh kosong',
                                            focusConfirm: false
                                        })
                                    }

                                }

                                $scope.pilihanSekolah1 = $scope.formData.sekolahZonasi;
                                $scope.pilihanSekolah2 = $scope.formData.sekolahJalur;
                                $scope.jarak = $scope.formData.jarak;
                                $scope.jalur = $scope.formData.jalur;
                                $scope.jalurNama = $scope.formData.jalurNama;

                                $scope.jalur2 = $scope.formData.jalur2;
                                $scope.jalurNama2 = $scope.formData.jalurNama2;
                                $scope.koreksi = $scope.formData.koreksi;

                                ////console.log($scope.jalur);
                                var idDesa = $scope.formData.idDesa;

                                var poinStatusKK;

                                if ($scope.formData.statusKK == 'Famili Lain') {
                                    poinStatusKK = 2;
                                } else {
                                    poinStatusKK = 1;
                                }

                                // DAFTAR JALUR LAIN
                                $scope.daftarJalurLain = function () {
                                    // window.alert('JALUR LAIN')
                                    $("#modal_daftarJalurWarning").modal('hide')
                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                        status_daftar: false,
                                    });
                                }

                                // DAFTAR ZONASI
                                $scope.daftarzonasi = function () {
                                    const swalDaftarZonasi = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalDaftarZonasi.fire({
                                        title: 'Daftar Jalur Zonasi',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin mendaftar di jalur zonasi ?',
                                        showCancelButton: true,
                                        confirmButtonText: 'Daftar',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            $ionicLoading.show();

                                            $("#modal_simpan_zonasi").modal('hide')
                                            var jarak = document.getElementById("jarak").value;
                                            var smpPil = document.getElementById("smpPil").value;
                                            console.log(poinStatusKK);
                                            console.log(jarak);
                                            console.log($scope.formData.umur);
                                            var umur = $scope.formData.umur;

                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);

                                            console.log(point);

                                            console.log($scope.formData.nama);



                                            firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                nama: $scope.formData.nama,
                                                nisn: $scope.formData.nisn,
                                                sekolah_asal: $scope.formData.sekolah_asal,
                                                jarak: parseInt(jarak),
                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                finalPoin: point,
                                                id_sd: $scope.formData.id_sd,
                                                jalur: 'zonasi',
                                                jalurNama: 'Zonasi',
                                                status_uprove: false,
                                                statusKK: $scope.formData.statusKK,
                                                no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                uid: useraktif.uid,

                                            }).then(function () {
                                                firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                    nama: $scope.formData.nama,
                                                    nisn: $scope.formData.nisn,
                                                    smpPilZonasi: smpPil,
                                                    id_smpPilZonasi: $scope.formData.sekolahZonasiId,
                                                    jarak: parseInt(jarak),
                                                    poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                    finalPoin: point,
                                                    jalur: 'zonasi',
                                                    jalurNama: 'Zonasi',
                                                    status_uprove: false,
                                                    no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                    uid: useraktif.uid,
                                                }).then(function () {

                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                        status_daftar: true,
                                                        status_daftarZonasi: true,
                                                        smpPilZonasi: smpPil,
                                                        smpPilZonasiid: $scope.formData.sekolahZonasiId,
                                                        jarak: parseInt(jarak),
                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        finalPoin: point,
                                                        jalur: 'zonasi',
                                                        jalurNama: 'Zonasi',
                                                        status_uprove: false,
                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                    }).then(function () {
                                                        $ionicLoading.hide();
                                                        $state.go('pendaftaran_ppdb');
                                                        var x = document.getElementById("zonasi");
                                                        x.style.display = "none";
                                                    })
                                                })
                                            })
                                        }
                                    })
                                }

                                // DAFTAR Zonasi Swasta
                                $scope.daftarzonasiSwasta = function () {
                                    $ionicLoading.show();

                                    var sekolahSwasta = document.getElementById("pilihanSekolahSwasta").value;
                                    var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahSwasta);
                                    var listNamaSekolah = $firebaseArray(namaSekolah);
                                    listNamaSekolah.$loaded().then(function (response) {
                                        $scope.namaSekolah = response[0].sekolah;
                                        console.log($scope.namaSekolah);
                                        console.log(sekolahSwasta);

                                        // MASUK KE SEKOLAH 1
                                        firebase.database().ref('smp/' + sekolahSwasta + '/zonasi/' + useraktif.uid).update({
                                            nama: $scope.formData.nama,
                                            nisn: $scope.formData.nisn,
                                            sekolah_asal: $scope.formData.sekolah_asal,
                                            jarak: '0',
                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                            finalPoin: parseFloat((poinStatusKK.toString() + '.0' + '.' + $scope.formData.umur.toString())),
                                            finalPoin2: parseFloat(('0.' + $scope.formData.umur.toString())),
                                            jalur: 'zonasi',
                                            jalurNama: 'Zonasi',
                                            status_uprove: false,
                                            no_pendaftaran: 'zonasi/2023/' + sekolahSwasta + '/' + $scope.formData.nisn,
                                            uid: useraktif.uid,

                                        });

                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                            nama: $scope.formData.nama,
                                            nisn: $scope.formData.nisn,
                                            smpPil: $scope.namaSekolah,
                                            smpPilZonasi: sekolahSwasta,
                                            jarak: '0',
                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                            finalPoin: parseFloat((poinStatusKK.toString() + '.0' + '.' + $scope.formData.umur.toString())),
                                            finalPoin2: parseFloat(('0.' + $scope.formData.umur.toString())),
                                            jalur: 'zonasi',
                                            jalurNama: 'Zonasi',
                                            status_uprove: false,
                                            no_pendaftaran: 'zonasi/2023/' + sekolahSwasta + '/' + $scope.formData.nisn,
                                            uid: useraktif.uid,
                                        });

                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                            status_daftar: true,
                                            status_daftarZonasi: true,

                                            jarak: '0',
                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                            finalPoin: parseFloat((poinStatusKK.toString() + '.0' + '.' + $scope.formData.umur.toString())),
                                            finalPoin2: parseFloat(('0.' + $scope.formData.umur.toString())),
                                            jalur: 'zonasi',
                                            jalurNama: 'Zonasi',
                                            status_uprove: false,
                                            no_pendaftaran: 'zonasi/2023/' + sekolahSwasta + '/' + $scope.formData.nisn,
                                            sekolahZonasi: $scope.namaSekolah,
                                            sekolahZonasiId: sekolahSwasta,

                                        });

                                    });
                                    // $state.go('pendaftaran_ppdb');
                                }

                                // DAFTAR AFIRMASI
                                $scope.daftarafirmasi = function () {
                                    const swalDaftarAfirmasi = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalDaftarAfirmasi.fire({
                                        title: 'Daftar Jalur Afirmasi',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin mendaftar di jalur afirmasi ?',
                                        showCancelButton: true,
                                        confirmButtonText: 'Daftar',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            if ($scope.statusdaftarZonasi == true) {
                                                $("#modal_simpan_afirmasi").modal('hide')
                                                $ionicLoading.show();
                                                // $("#modal_simpan_zonasi").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;

                                                var umur = $scope.formData.umur;

                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);

                                                var dokumenAfirmasi = document.getElementById("jenisDokumen").value;
                                                //console.log(dokumenAfirmasi);
                                                var sekolahAfirmasi = $scope.form.idSekolahAfirmasi;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahAfirmasi);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    // console.log($scope.namaSekolah);
                                                    console.log(sekolahAfirmasi);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahAfirmasi == sekolahZonasi) {
                                                        // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        })
                                                        $ionicLoading.hide();
                                                        // MASUK KE SEKOLAH 1
                                                        // firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     uid: useraktif.uid,

                                                        //     // jarak: parseInt(jarak),
                                                        //     // finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     // jalur: 'zonasi',
                                                        //     // jalurNama: 'Zonasi',
                                                        //     // status_uprove: false,
                                                        //     // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,


                                                        // });

                                                        // // MASUK KE SEKOLAH 2
                                                        // firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     status_uprove: false,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     uid: useraktif.uid,

                                                        // });

                                                        // firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     smpPil: $scope.namaSekolah,
                                                        //     smpPilZonasi: smpPilZonasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // firebase.database().ref('siswa/' + useraktif.uid).update({
                                                        //     status_daftar: true,
                                                        //     status_daftarZonasi: true,
                                                        //     status_daftarJalur: true,
                                                        //     dokumenAfirmasi: dokumenAfirmasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // // MASUK KE SEKOLAH 2


                                                        // // File 
                                                        // var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        // var storageDok = $firebaseStorage(storageRefDok);
                                                        // var fileDok = document.getElementById("inputberkas").files[0];

                                                        // var metadata = {
                                                        //     contentType: fileDok.type
                                                        // }
                                                        // //Upload File
                                                        // ////console.log(file);
                                                        // var uploadTask = storageDok.$put(fileDok);
                                                        // $ionicLoading.show();

                                                        // uploadTask.$complete(function (snapshot) {
                                                        //     //console.log(snapshot);
                                                        //     storageRefDok.getDownloadURL().then(function (url) {
                                                        //         //console.log(url);
                                                        //         var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                        //         refAddFoto.set({
                                                        //             "URL": url,
                                                        //             "namaFile": snapshot.metadata.name
                                                        //         }).then(function (response) {
                                                        //             $ionicLoading.hide();
                                                        //             ////console.log(response);
                                                        //             return true;
                                                        //         }).then(function (error) {
                                                        //             ////console.log(error);
                                                        //         });
                                                        //     }).catch(function (error) {
                                                        //         // Handle any errors
                                                        //     });
                                                        // })
                                                        // $ionicLoading.hide();
                                                        // // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            statusKK: $scope.formData.statusKK,
                                                            uid: useraktif.uid,

                                                            // status_uprove: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,

                                                        });


                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            dokumenAfirmasi: dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        // MASUK KE SEKOLAH 2


                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("inputberkas").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')

                                                    }

                                                });
                                                // $state.go('pendaftaran_ppdb');
                                            } else {
                                                $("#modal_simpan_afirmasi").modal('hide')
                                                $ionicLoading.show();
                                                // $("#modal_simpan_zonasi").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;

                                                var umur = $scope.formData.umur;

                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);

                                                var dokumenAfirmasi = document.getElementById("jenisDokumen").value;
                                                //console.log(dokumenAfirmasi);
                                                var sekolahAfirmasi = $scope.form.idSekolahAfirmasi;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahAfirmasi);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    // console.log($scope.namaSekolah);
                                                    console.log(sekolahAfirmasi);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahAfirmasi == sekolahZonasi) {
                                                        // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        })
                                                        $ionicLoading.hide();
                                                        // MASUK KE SEKOLAH 1
                                                        // firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     uid: useraktif.uid,

                                                        //     // jarak: parseInt(jarak),
                                                        //     // finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     // jalur: 'zonasi',
                                                        //     // jalurNama: 'Zonasi',
                                                        //     // status_uprove: false,
                                                        //     // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,


                                                        // });

                                                        // // MASUK KE SEKOLAH 2
                                                        // firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     sekolah_asal: $scope.formData.sekolah_asal,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     status_uprove: false,
                                                        //     statusKK: $scope.formData.statusKK,
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     uid: useraktif.uid,

                                                        // });

                                                        // firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                        //     nama: $scope.formData.nama,
                                                        //     nisn: $scope.formData.nisn,
                                                        //     smpPil: $scope.namaSekolah,
                                                        //     smpPilZonasi: smpPilZonasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // firebase.database().ref('siswa/' + useraktif.uid).update({
                                                        //     status_daftar: true,
                                                        //     status_daftarZonasi: true,
                                                        //     status_daftarJalur: true,
                                                        //     dokumenAfirmasi: dokumenAfirmasi,
                                                        //     jarak: parseInt(jarak),
                                                        //     poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                        //     finalPoin: parseFloat((poinStatusKK.toString() + '.' + jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                        //     jalur: 'zonasi',
                                                        //     jalurNama: 'Zonasi',
                                                        //     no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                        //     jalur2: 'afirmasi',
                                                        //     jalurNama2: 'Afirmasi',
                                                        //     status_uprove2: false,
                                                        //     no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                        //     sekolahJalur: $scope.namaSekolah,
                                                        //     sekolahJalurId: sekolahAfirmasi,
                                                        // });

                                                        // // MASUK KE SEKOLAH 2


                                                        // // File 
                                                        // var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        // var storageDok = $firebaseStorage(storageRefDok);
                                                        // var fileDok = document.getElementById("inputberkas").files[0];

                                                        // var metadata = {
                                                        //     contentType: fileDok.type
                                                        // }
                                                        // //Upload File
                                                        // ////console.log(file);
                                                        // var uploadTask = storageDok.$put(fileDok);
                                                        // $ionicLoading.show();

                                                        // uploadTask.$complete(function (snapshot) {
                                                        //     //console.log(snapshot);
                                                        //     storageRefDok.getDownloadURL().then(function (url) {
                                                        //         //console.log(url);
                                                        //         var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                        //         refAddFoto.set({
                                                        //             "URL": url,
                                                        //             "namaFile": snapshot.metadata.name
                                                        //         }).then(function (response) {
                                                        //             $ionicLoading.hide();
                                                        //             ////console.log(response);
                                                        //             return true;
                                                        //         }).then(function (error) {
                                                        //             ////console.log(error);
                                                        //         });
                                                        //     }).catch(function (error) {
                                                        //         // Handle any errors
                                                        //     });
                                                        // })
                                                        // $ionicLoading.hide();
                                                        // // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahAfirmasi + '/afirmasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            statusKK: $scope.formData.statusKK,
                                                            uid: useraktif.uid,

                                                            // status_uprove: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,

                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            id_sd: $scope.formData.id_sd,
                                                            // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            status_uprove: false,
                                                            statusKK: $scope.formData.statusKK,
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,

                                                        });

                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            dokumenAfirmasi: dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'afirmasi',
                                                            jalurNama2: 'Afirmasi',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'afirmasi/2023/' + sekolahAfirmasi + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahAfirmasi,
                                                        });

                                                        // MASUK KE SEKOLAH 2


                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("inputberkas").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDok')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')

                                                    }

                                                });
                                                // $state.go('pendaftaran_ppdb');
                                            }
                                        }
                                    })

                                }

                                // DAFTAR PERPINDAHAN
                                var pilihan = "";
                                $scope.pilihanberkaspindahan = function () {
                                    pilihan = $scope.form.jenisDoc;
                                    //console.log(pilihan);

                                    if (pilihan == 'Surat Penugasan Ortu / Wali') {
                                        $scope.statusPerpindahan = true;
                                    } else {
                                        $scope.statusPerpindahan = false;
                                    }
                                }

                                $scope.daftarperpindahan = function () {
                                    const swalDaftarPerpindahan = Swal.mixin({
                                        customClass: {
                                            confirmButton: 'btn btn-primary ms-2',
                                            cancelButton: 'btn btn-outline-secondary'
                                        },
                                        buttonsStyling: false
                                    })
                                    swalDaftarPerpindahan.fire({
                                        title: 'Daftar Jalur Perpindahan ',
                                        icon: 'warning',
                                        text: 'Apakah anda yakin mendaftar di jalur Perpindahan  ?',
                                        showCancelButton: true,
                                        confirmButtonText: 'Daftar',
                                        reverseButtons: true
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            if ($scope.statusdaftarZonasi == true) {
                                                // window.alert('SUDAH DAFTAR ZONASI SEBELUMNYA')
                                                $ionicLoading.show();
                                                $("#modal_simpan_perpindahan").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                var umur = $scope.formData.umur;
                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);
                                                var sekolahPerpindahan = $scope.form.idSekolahPerpindahan;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPerpindahan);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    //console.log($scope.namaSekolah);
                                                    //console.log(sekolahPerpindahan);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahPerpindahan == sekolahZonasi) {
                                                        $ionicLoading.hide();
                                                        Swal.fire({
                                                            icon: 'warning',
                                                            title: 'Perhatian',
                                                            text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        })
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahPerpindahan + '/perpindahan/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                            uid: useraktif.uid,


                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            id_sd: $scope.formData.id_sd,
                                                            // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            // status_uprove: false,
                                                            statusKK: $scope.formData.statusKK,
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,

                                                        });

                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur: 'perpindahan',
                                                            jalurNama: 'Perpindahan',
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            // dokumenAfirmasi : dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("berkasPerpindahan").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPerpindahan')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')
                                                    }

                                                });
                                                $state.go('pendaftaran_ppdb');
                                            } else {
                                                $ionicLoading.show();
                                                $("#modal_simpan_perpindahan").modal('hide')
                                                var jarak = $scope.formData.jarak;
                                                var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                var umur = $scope.formData.umur;
                                                var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                //console.log($scope.formData.nama);
                                                var sekolahPerpindahan = $scope.form.idSekolahPerpindahan;
                                                var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPerpindahan);
                                                var listNamaSekolah = $firebaseArray(namaSekolah);
                                                listNamaSekolah.$loaded().then(function (response) {
                                                    $scope.namaSekolah = response[0].sekolah;
                                                    //console.log($scope.namaSekolah);
                                                    //console.log(sekolahPerpindahan);
                                                    var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                    console.log(sekolahZonasi);

                                                    if (sekolahPerpindahan == sekolahZonasi) {
                                                        // Swal.fire({
                                                        //     icon: 'warning',
                                                        //     title: 'Perhatian',
                                                        //     text: 'Tidak dapat mendaftar di sekolah yang sama dengan sekolah wilayah zonasi',
                                                        // })
                                                        const swalDaftarPerpindahanyes = Swal.mixin({
                                                            customClass: {
                                                                confirmButton: 'btn btn-primary ms-2',
                                                                cancelButton: 'btn btn-outline-secondary'
                                                            },
                                                            buttonsStyling: false
                                                        })
                                                        swalDaftarPerpindahanyes.fire({
                                                            title: 'Perhatian',
                                                            icon: 'warning',
                                                            text: 'Sekolah yang anda pilih berada di daerah zonasi anda, setelah klik Lanjutkan , data anda hanya terdaftar sebagai peserta Jalur Perpindahan Tugas Orang Tua',
                                                            showCancelButton: true,
                                                            confirmButtonText: 'Lanjutkan',
                                                            reverseButtons: true
                                                        }).then((result) => {
                                                            // MASUK KE SEKOLAH 1
                                                            firebase.database().ref('smp/' + sekolahPerpindahan + '/perpindahan/' + useraktif.uid).update({
                                                                nama: $scope.formData.nama,
                                                                nisn: $scope.formData.nisn,
                                                                sekolah_asal: $scope.formData.sekolah_asal,
                                                                jarak: parseInt(jarak),
                                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                finalPoin: point,
                                                                //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                // status_uprove: false,
                                                                status_uprove2: false,
                                                                // jalur: 'zonasi',
                                                                // jalurNama: 'Zonasi',
                                                                // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                jalur2: 'perpindahan',
                                                                jalurNama2: 'Perpindahan',
                                                                no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                                sekolahJalur: $scope.namaSekolah,
                                                                sekolahJalurId: sekolahPerpindahan,
                                                                uid: useraktif.uid,


                                                            });

                                                            firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                nama: $scope.formData.nama,
                                                                nisn: $scope.formData.nisn,
                                                                smpPil: $scope.namaSekolah,
                                                                smpPilZonasi: smpPilZonasi,
                                                                jarak: parseInt(jarak),
                                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                finalPoin: point,
                                                                //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                // jalur: 'zonasi',
                                                                // jalurNama: 'Zonasi',
                                                                // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                jalur: 'perpindahan',
                                                                jalurNama: 'Perpindahan',
                                                                // status_uprove: false,
                                                                status_uprove2: false,
                                                                no_pendaftaran: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                                uid: useraktif.uid,
                                                            });

                                                            firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                status_daftar: true,
                                                                // status_daftarZonasi: true,
                                                                status_daftarJalur: true,
                                                                // dokumenAfirmasi : dokumenAfirmasi,
                                                                jarak: parseInt(jarak),
                                                                poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                finalPoin: point,
                                                                //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                // jalur: 'zonasi',
                                                                // jalurNama: 'Zonasi',
                                                                // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                jalur2: 'perpindahan',
                                                                jalurNama2: 'Perpindahan',
                                                                // status_uprove: false,
                                                                status_uprove2: false,
                                                                no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                                sekolahJalur: $scope.namaSekolah,
                                                                sekolahJalurId: sekolahPerpindahan,
                                                            });

                                                            // MASUK KE SEKOLAH 2
                                                            // File 
                                                            var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                            var storageDok = $firebaseStorage(storageRefDok);
                                                            var fileDok = document.getElementById("berkasPerpindahan").files[0];

                                                            var metadata = {
                                                                contentType: fileDok.type
                                                            }
                                                            //Upload File
                                                            ////console.log(file);
                                                            var uploadTask = storageDok.$put(fileDok);
                                                            $ionicLoading.show();

                                                            uploadTask.$complete(function (snapshot) {
                                                                //console.log(snapshot);
                                                                storageRefDok.getDownloadURL().then(function (url) {
                                                                    //console.log(url);
                                                                    var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPerpindahan')
                                                                    refAddFoto.set({
                                                                        "URL": url,
                                                                        "namaFile": snapshot.metadata.name
                                                                    }).then(function (response) {
                                                                        $ionicLoading.hide();
                                                                        ////console.log(response);
                                                                        return true;
                                                                    }).then(function (error) {
                                                                        ////console.log(error);
                                                                    });
                                                                }).catch(function (error) {
                                                                    // Handle any errors
                                                                });
                                                            })
                                                            $ionicLoading.hide();
                                                            // window.alert('Terdaftar')
                                                            // $("#modal_simpan_zonasi").modal('hide')
                                                            // window.alert('Terdaftar')
                                                            $("#modal_simpan_zonasi").modal('hide')
                                                        })
                                                        $ionicLoading.hide();
                                                    } else {
                                                        // MASUK KE SEKOLAH 1
                                                        firebase.database().ref('smp/' + sekolahPerpindahan + '/perpindahan/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            // status_uprove: false,
                                                            status_uprove2: false,
                                                            // jalur: 'zonasi',
                                                            // jalurNama: 'Zonasi',
                                                            // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                            uid: useraktif.uid,


                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            sekolah_asal: $scope.formData.sekolah_asal,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            id_sd: $scope.formData.id_sd,
                                                            // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            status_uprove: false,
                                                            statusKK: $scope.formData.statusKK,
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,

                                                        });

                                                        firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                            nama: $scope.formData.nama,
                                                            nisn: $scope.formData.nisn,
                                                            smpPil: $scope.namaSekolah,
                                                            smpPilZonasi: smpPilZonasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur: 'perpindahan',
                                                            jalurNama: 'Perpindahan',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            uid: useraktif.uid,
                                                        });

                                                        firebase.database().ref('siswa/' + useraktif.uid).update({
                                                            status_daftar: true,
                                                            status_daftarZonasi: true,
                                                            status_daftarJalur: true,
                                                            // dokumenAfirmasi : dokumenAfirmasi,
                                                            jarak: parseInt(jarak),
                                                            poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                            finalPoin: point,
                                                            //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                            jalur: 'zonasi',
                                                            jalurNama: 'Zonasi',
                                                            no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                            jalur2: 'perpindahan',
                                                            jalurNama2: 'Perpindahan',
                                                            status_uprove: false,
                                                            status_uprove2: false,
                                                            no_pendaftaran2: 'perpindahan/2023/' + sekolahPerpindahan + '/' + $scope.formData.nisn,
                                                            sekolahJalur: $scope.namaSekolah,
                                                            sekolahJalurId: sekolahPerpindahan,
                                                        });

                                                        // MASUK KE SEKOLAH 2
                                                        // File 
                                                        var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Dok');
                                                        var storageDok = $firebaseStorage(storageRefDok);
                                                        var fileDok = document.getElementById("berkasPerpindahan").files[0];

                                                        var metadata = {
                                                            contentType: fileDok.type
                                                        }
                                                        //Upload File
                                                        ////console.log(file);
                                                        var uploadTask = storageDok.$put(fileDok);
                                                        $ionicLoading.show();

                                                        uploadTask.$complete(function (snapshot) {
                                                            //console.log(snapshot);
                                                            storageRefDok.getDownloadURL().then(function (url) {
                                                                //console.log(url);
                                                                var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPerpindahan')
                                                                refAddFoto.set({
                                                                    "URL": url,
                                                                    "namaFile": snapshot.metadata.name
                                                                }).then(function (response) {
                                                                    $ionicLoading.hide();
                                                                    ////console.log(response);
                                                                    return true;
                                                                }).then(function (error) {
                                                                    ////console.log(error);
                                                                });
                                                            }).catch(function (error) {
                                                                // Handle any errors
                                                            });
                                                        })
                                                        $ionicLoading.hide();
                                                        // window.alert('Terdaftar')
                                                        // $("#modal_simpan_zonasi").modal('hide')
                                                        // window.alert('Terdaftar')
                                                        $("#modal_simpan_zonasi").modal('hide')
                                                    }

                                                });
                                                $state.go('pendaftaran_ppdb');
                                            }
                                        }
                                    })
                                }
                                // DAFTAR PRESTASI
                                var pilihan = "";
                                $scope.pilihanjenisprestasi = function () {
                                    pilihan = $scope.form.jenisPrestasi;
                                    console.log(pilihan);

                                    if (pilihan == 'keterampilan') {
                                        $scope.statusRaport = false;
                                        $scope.statusKeterampilan = true;
                                    } else if (pilihan == 'rapor') {
                                        $scope.statusRaport = true;
                                        $scope.statusKeterampilan = false;
                                    } else {
                                        $scope.statusRaport = false;
                                        $scope.statusKeterampilan = false;
                                    }
                                }
                                $scope.daftarprestasi = function () {
                                    console.log('TEKAN DAFTAR PRESTASI')
                                    var jenisPrestasi = document.getElementById("jenisPrestasi").value;
                                    // console.log(jenisPrestasi);
                                    if (jenisPrestasi != '') {
                                        if ($scope.statusdaftarZonasi == true) {
                                            console.log('SUDAH DAFTAR ZONASI')
                                            if (jenisPrestasi == 'rapor') {
                                                console.log('JALUR RAPORT');
                                                var suratRapor = document.getElementById("berkasraport").value;
                                                var peringkatRapor = document.getElementById("peringkatraport").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                if (suratRapor != '' && peringkatRapor != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });


                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        // //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        // jalur: 'zonasi',
                                                                        // jalurNama: 'Zonasi',
                                                                        // no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Jalur Nilai Rapor',
                                                                        peringkatRapor: peringkatRapor,
                                                                        akumulasiRaporPrestasi: akumulasiRapor


                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasraport").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'keterampilan') {
                                                console.log('JALUR KETERAMPILAN');
                                                var deskripsiKeterampilan = document.getElementById("deskripsi").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var berkasketerampilan = document.getElementById("berkasketerampilan").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                console.log(deskripsiKeterampilan);
                                                console.log(akumulasiRapor);
                                                console.log(berkasketerampilan);
                                                console.log(sekolahPrestasi);

                                                if (berkasketerampilan != '' && deskripsiKeterampilan != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {

                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        // //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Keterampilan Lain',
                                                                        deskripsiKeterampilan: deskripsiKeterampilan,
                                                                        akumulasiRaporPrestasi: akumulasiRapor


                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasketerampilan").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'akademik') {
                                                console.log('JALUR AKADEMIK');
                                                var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                var cabang = document.getElementById("cabangKompetisi").value;
                                                var peringkat = document.getElementById("juaraPrestasi").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;
                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);
                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        // //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,


                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })

                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }
                                            } else {
                                                const swalDaftarPrestasi = Swal.mixin({
                                                    customClass: {
                                                        confirmButton: 'btn btn-primary ms-2',
                                                        cancelButton: 'btn btn-outline-secondary'
                                                    },
                                                    buttonsStyling: false
                                                })
                                                swalDaftarPrestasi.fire({
                                                    title: 'Daftar Jalur Prestasi ',
                                                    icon: 'warning',
                                                    text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Daftar',
                                                    reverseButtons: true
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        console.log('NON AKADEMIK');
                                                        var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                        var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                        var cabang = document.getElementById("cabangKompetisi").value;
                                                        var peringkat = document.getElementById("juaraPrestasi").value;
                                                        var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                        var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                        var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                        if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        //status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: ' NON AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,


                                                                    });
                                                                    // MASUK KE SEKOLAH 2
                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Pastikan form sudah terisi lengkap',
                                                                focusConfirm: false
                                                            })
                                                        }


                                                    }
                                                })
                                            }
                                        } else {
                                            console.log('BELUM DAFTAR ZONASI')
                                            if (jenisPrestasi == 'rapor') {
                                                console.log('JALUR RAPORT');
                                                var suratRapor = document.getElementById("berkasraport").value;
                                                var peringkatRapor = document.getElementById("peringkatraport").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                if (suratRapor != '' && peringkatRapor != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });


                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Jalur Nilai Rapor',
                                                                        peringkatRapor: peringkatRapor,
                                                                        akumulasiRaporPrestasi: akumulasiRapor


                                                                    });


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasraport").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'keterampilan') {
                                                console.log('JALUR KETERAMPILAN');
                                                var deskripsiKeterampilan = document.getElementById("deskripsi").value;
                                                var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                var berkasketerampilan = document.getElementById("berkasketerampilan").value;
                                                var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                console.log(deskripsiKeterampilan);
                                                console.log(akumulasiRapor);
                                                console.log(berkasketerampilan);
                                                console.log(sekolahPrestasi);

                                                if (berkasketerampilan != '' && deskripsiKeterampilan != '' && akumulasiRapor != '' && sekolahPrestasi != undefined) {
                                                    const swalDaftarPrestasi = Swal.mixin({
                                                        customClass: {
                                                            confirmButton: 'btn btn-primary ms-2',
                                                            cancelButton: 'btn btn-outline-secondary'
                                                        },
                                                        buttonsStyling: false
                                                    })
                                                    swalDaftarPrestasi.fire({
                                                        title: 'Daftar Jalur Prestasi ',
                                                        icon: 'warning',
                                                        text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Daftar',
                                                        reverseButtons: true
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {

                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'Keterampilan Lain',
                                                                        deskripsiKeterampilan: deskripsiKeterampilan,
                                                                        akumulasiRaporPrestasi: akumulasiRapor
                                                                    });

                                                                    // MASUK KE SEKOLAH 2


                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasketerampilan").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        }
                                                    })
                                                } else {
                                                    Swal.fire({
                                                        icon: 'warning',
                                                        title: 'Perhatian',
                                                        text: 'Pastikan form sudah terisi lengkap',
                                                        focusConfirm: false
                                                    })
                                                }

                                            } else if (jenisPrestasi == 'akademik') {
                                                const swalDaftarPrestasi = Swal.mixin({
                                                    customClass: {
                                                        confirmButton: 'btn btn-primary ms-2',
                                                        cancelButton: 'btn btn-outline-secondary'
                                                    },
                                                    buttonsStyling: false
                                                })
                                                swalDaftarPrestasi.fire({
                                                    title: 'Daftar Jalur Prestasi ',
                                                    icon: 'warning',
                                                    text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Daftar',
                                                    reverseButtons: true
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        console.log('JALUR AKADEMIK');
                                                        var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                        var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                        var cabang = document.getElementById("cabangKompetisi").value;
                                                        var peringkat = document.getElementById("juaraPrestasi").value;
                                                        var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                        var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                        var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                        if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                            $ionicLoading.show();

                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: 'AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,
                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Pastikan form sudah terisi lengkap',
                                                                focusConfirm: false
                                                            })
                                                        }
                                                    }
                                                })
                                            } else {
                                                const swalDaftarPrestasi = Swal.mixin({
                                                    customClass: {
                                                        confirmButton: 'btn btn-primary ms-2',
                                                        cancelButton: 'btn btn-outline-secondary'
                                                    },
                                                    buttonsStyling: false
                                                })
                                                swalDaftarPrestasi.fire({
                                                    title: 'Daftar Jalur Prestasi ',
                                                    icon: 'warning',
                                                    text: 'Apakah anda yakin mendaftar di jalur Prestasi  ?',
                                                    showCancelButton: true,
                                                    confirmButtonText: 'Daftar',
                                                    reverseButtons: true
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        console.log('NON AKADEMIK');
                                                        var tingkatprestasi = document.getElementById("tingkatprestasi").value;
                                                        var namaKompetisi = document.getElementById("namaKompetisi").value;
                                                        var cabang = document.getElementById("cabangKompetisi").value;
                                                        var peringkat = document.getElementById("juaraPrestasi").value;
                                                        var akumulasiRapor = document.getElementById("akumulasiRaportPrestasi").value;
                                                        var berkasprestasi = document.getElementById("berkasprestasi").value;
                                                        var sekolahPrestasi = $scope.form.idSekolahPrestasi;

                                                        if (tingkatprestasi != '' && namaKompetisi != '' && cabang != '' && peringkat != '' && akumulasiRapor != '' && berkasprestasi != '' && sekolahPrestasi != undefined) {
                                                            $ionicLoading.show();
                                                            $("#modal_simpan_prestasi").modal('hide')
                                                            var jarak = $scope.formData.jarak;
                                                            var smpPilZonasi = $scope.formData.sekolahZonasi;
                                                            var umur = $scope.formData.umur;

                                                            var point = parseFloat((poinStatusKK * jarak) + '.' + umur);
                                                            //console.log($scope.formData.nama);

                                                            var sekolahPrestasi = $scope.form.idSekolahPrestasi;
                                                            var namaSekolah = firebase.database().ref("sekolah").orderByChild("id_sekolah").equalTo(sekolahPrestasi);
                                                            var listNamaSekolah = $firebaseArray(namaSekolah);
                                                            listNamaSekolah.$loaded().then(function (response) {
                                                                $scope.namaSekolah = response[0].sekolah;
                                                                //console.log($scope.namaSekolah);
                                                                console.log(sekolahPrestasi);
                                                                var sekolahZonasi = $scope.formData.sekolahZonasiId;
                                                                console.log(sekolahZonasi);
                                                                if (sekolahPrestasi == sekolahZonasi) {
                                                                    // window.alert('TIDAK BOLEH MENDAFTAR DI SEKOLAH YANG SAMA DENGAN SEKOLAH DI WILAYAH ZONASI ANDA')
                                                                    Swal.fire({
                                                                        icon: 'warning',
                                                                        title: 'Perhatian',
                                                                        text: 'Tidak boleh mendaftar di sekolah yang sama dengan sekolah di wilayah zonasi anda',
                                                                        focusConfirm: false
                                                                    })
                                                                    $ionicLoading.hide();
                                                                } else {
                                                                    // MASUK KE SEKOLAH 1
                                                                    firebase.database().ref('smp/' + sekolahPrestasi + '/prestasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    // MASUK KE SEKOLAH 2
                                                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/zonasi/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        sekolah_asal: $scope.formData.sekolah_asal,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        id_sd: $scope.formData.id_sd,
                                                                        // finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        status_uprove: false,
                                                                        statusKK: $scope.formData.statusKK,
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,

                                                                    });

                                                                    firebase.database().ref('sd/' + $scope.formData.id_sd + '/' + useraktif.uid).update({
                                                                        nama: $scope.formData.nama,
                                                                        nisn: $scope.formData.nisn,
                                                                        smpPil: $scope.namaSekolah,
                                                                        smpPilZonasi: smpPilZonasi,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        // status_uprove: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        uid: useraktif.uid,
                                                                    });

                                                                    firebase.database().ref('siswa/' + useraktif.uid).update({
                                                                        status_daftar: true,
                                                                        status_daftarZonasi: true,
                                                                        status_daftarJalur: true,
                                                                        jarak: parseInt(jarak),
                                                                        poinStatusKK: parseFloat(poinStatusKK.toString()),
                                                                        finalPoin: point,
                                                                        //finalPoin2: parseFloat((jarak.toString() + '.' + $scope.formData.umur.toString())),
                                                                        jalur: 'zonasi',
                                                                        jalurNama: 'Zonasi',
                                                                        no_pendaftaran: 'zonasi/2023/' + $scope.formData.sekolahZonasiId + '/' + $scope.formData.nisn,
                                                                        jalur2: 'prestasi',
                                                                        jalurNama2: 'Prestasi',
                                                                        status_uprove: false,
                                                                        status_uprove2: false,
                                                                        no_pendaftaran2: 'prestasi/2023/' + sekolahPrestasi + '/' + $scope.formData.nisn,
                                                                        sekolahJalur: $scope.namaSekolah,
                                                                        sekolahJalurId: sekolahPrestasi,
                                                                        jenisPrestasi: ' NON AKADEMIK',
                                                                        tingkatprestasi: tingkatprestasi,
                                                                        namaKompetisi: namaKompetisi,
                                                                        cabang: cabang,
                                                                        peringkat: peringkat,
                                                                        akumulasiRaporPrestasi: akumulasiRapor,


                                                                    });
                                                                    // MASUK KE SEKOLAH 2
                                                                    // File 
                                                                    var storageRefDok = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'Prestasi');
                                                                    var storageDok = $firebaseStorage(storageRefDok);
                                                                    var fileDok = document.getElementById("berkasprestasi").files[0];

                                                                    var metadata = {
                                                                        contentType: fileDok.type
                                                                    }
                                                                    //Upload File
                                                                    ////console.log(file);
                                                                    var uploadTask = storageDok.$put(fileDok);
                                                                    $ionicLoading.show();

                                                                    uploadTask.$complete(function (snapshot) {
                                                                        //console.log(snapshot);
                                                                        storageRefDok.getDownloadURL().then(function (url) {
                                                                            //console.log(url);
                                                                            var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDokPrestasi')
                                                                            refAddFoto.set({
                                                                                "URL": url,
                                                                                "namaFile": snapshot.metadata.name
                                                                            }).then(function (response) {
                                                                                $ionicLoading.hide();
                                                                                ////console.log(response);
                                                                                return true;
                                                                            }).then(function (error) {
                                                                                ////console.log(error);
                                                                            });
                                                                        }).catch(function (error) {
                                                                            // Handle any errors
                                                                        });
                                                                    })
                                                                    $ionicLoading.hide();
                                                                    // window.alert('Terdaftar')
                                                                    // $("#modal_simpan_zonasi").modal('hide')
                                                                }

                                                            });
                                                        } else {
                                                            Swal.fire({
                                                                icon: 'warning',
                                                                title: 'Perhatian',
                                                                text: 'Pastikan form sudah terisi lengkap',
                                                                focusConfirm: false
                                                            })
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    } else {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Perhatian',
                                            text: 'Jenis Prestasi Tidak Boleh Kosong',
                                            focusConfirm: false
                                        })
                                    }
                                }
                            })
                        });
                    } else {
                        //   window.alert("ID KOSONG");
                    }

                })
                //CEK KELENGKAPAN SKL
                var data_skl = firebase.database().ref('siswa/' + useraktif.uid);
                data_skl.on("value", function (snapshot) {
                    $scope.statusSKL = snapshot.val().status_skl;
                })

                var berkas_skl = firebase.database().ref('siswa/' + useraktif.uid + '/file/URL');
                berkas_skl.on("value", function (snapshot) {
                    ////console.log(snapshot.val());
                    $scope.statusBerkas = snapshot.val();
                    if (snapshot.val() != null) {
                        console.log('ADA BERKAS SKL');
                    }
                    else {
                        console.log('TIDAK BERKAS ADA SKL')
                    }
                })

            }
            else {
                console.log('TIDAK AKTIF')
            }

        });
    }])