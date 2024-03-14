angular.module('app.user', [])
    .controller('pendaftaranKembaliCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {
        $("#alert-alterPass-danger").hide();
        $ionicLoading.show();
        //CEK STATUS USER
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //console.log('USER AKTIF');
                var useraktif = firebase.auth().currentUser;
                //console.log(useraktif.uid);
                var dbRef = firebase.database();
                var pengguna = dbRef.ref('siswa/' + useraktif.uid);
                pengguna.on("value", function (snapshot) {
                    //console.log(snapshot.val());
                    if (snapshot.val() != null) {
                        snapshot.forEach(function (data) {
                            let firebaseRefKey = firebase.database().ref('siswa/' + useraktif.uid);
                            firebaseRefKey.on('value', (dataSnapShot) => {
                                $scope.formData = {
                                    "nisn": dataSnapShot.val().nisn,
                                    "nama": dataSnapShot.val().nama,
                                    "nik": dataSnapShot.val().nik,
                                    "noHp": dataSnapShot.val().noHp,
                                    "jalur": dataSnapShot.val().jalur,
                                    "jalurNama": dataSnapShot.val().jalurNama,
                                    "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                    "no_pendaftaran": dataSnapShot.val().no_pendaftaran,
                                    "sekolah_asal": dataSnapShot.val().sekolah_asal,
                                    "alamat": dataSnapShot.val().alamat,
                                    "tempat_lahir": dataSnapShot.val().tempat_lahir,
                                    "tanggal_lahir": dataSnapShot.val().tanggal_lahir,
                                    "jalur": dataSnapShot.val().jalur,
                                    "sekolahZonasiId": dataSnapShot.val().sekolahZonasiId,
                                    "sekolahZonasi": dataSnapShot.val().sekolahZonasi,
                                    "sekolahJalurId": dataSnapShot.val().sekolahJalurId,
                                    "sekolahJalur": dataSnapShot.val().sekolahJalur,
                                    "sttsDaftarUlang": dataSnapShot.val().sttsDaftarUlang,
                                };
                                $scope.statusvalidasi = dataSnapShot.val().status_uprove;
                                // document.getElementById("daftar_nama_lengkap").value = dataSnapShot.val().nama;
                                // document.getElementById("daftar_nisn").value = dataSnapShot.val().nisn;
                            })
                        });
                        $scope.sttsDaful = $scope.formData.sttsDaftarUlang;
                        $ionicLoading.hide();
                        $scope.daftar_ulang = function () {
                            // $("#wrapper").toggleClass("toggled");

                            if (!document.querySelector("#inputBerkas").files[0]) {
                                window.alert("Surar pernyataan daftar ulang tidak boleh kosong")
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'perhatian',
                                    text: 'Surat pernyataan daftar ulang tidak boleh kosong',
                                    focusConfirm: false
                                  })
                            } else {
                                firebase.database().ref('siswa/' + useraktif.uid).update({
                                    sttsDaftarUlang: true,
                                });

                                if ($scope.formData.jalur == 'zonasi') {
                                    firebase.database().ref('smp/' + $scope.formData.sekolahZonasiId + '/daftarUlang/' + useraktif.uid).update({
                                        nama: $scope.formData.nama,
                                        nisn: $scope.formData.nisn,
                                        noHp: $scope.formData.noHp,
                                        sekolah_asal: $scope.formData.sekolah_asal,
                                        jalur: $scope.formData.jalur,
                                        jalurNama: $scope.formData.jalurNama,
                                        // status_uprove: false,
                                        no_pendaftaran: $scope.formData.no_pendaftaran,
                                        uid: useraktif.uid,
                                    });
                                } else {
                                    firebase.database().ref('smp/' + $scope.formData.sekolahJalurId + '/daftarUlang/' + useraktif.uid).update({
                                        nama: $scope.formData.nama,
                                        nisn: $scope.formData.nisn,
                                        noHp: $scope.formData.noHp,
                                        sekolah_asal: $scope.formData.sekolah_asal,
                                        jalur: $scope.formData.jalur,
                                        jalurNama: $scope.formData.jalurNama,
                                        // status_uprove: false,
                                        no_pendaftaran: $scope.formData.no_pendaftaran,
                                        uid: useraktif.uid,
                                    });
                                }

                                // File sertif
                                var storageRefSertif = firebase.storage().ref("siswa/" + useraktif.uid + "/" + 'daftarulang');
                                var storageSertif = $firebaseStorage(storageRefSertif);
                                var fileSertif = document.querySelector("#inputBerkas").files[0];

                                var metadata = {
                                    contentType: fileSertif.type
                                }
                                //Upload File
                                ////console.log(file);
                                var uploadTask = storageSertif.$put(fileSertif);
                                $ionicLoading.show();

                                uploadTask.$complete(function (snapshot) {
                                    //console.log(snapshot);
                                    storageRefSertif.getDownloadURL().then(function (url) {
                                        //console.log(url);
                                        var refAddFoto = firebase.database().ref('siswa/' + useraktif.uid + '/fileDaftarulang')
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

                            }


                        }
                    } else {
                        //console.log("ID KOSONG");
                    }
                })
            }
            else {
                //console.log('TIDAK AKTIF')
            }
            $scope.toogle = function () {
                // toogle.preventDefault();
                $("#wrapper").toggleClass("toggled");
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
            $scope.pendaftaran_ppdb = function () {
                $ionicLoading.show();
                $state.go('pendaftaran_ppdb', {}, { reload: 'pendaftaran_ppdb' });
            }

            $scope.pendaftaran_kembali = function () {
                $ionicLoading.show();
                $state.go('pendaftaran_kembali');
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
        });
    }])

    .controller('tesCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        // $scope.simpan2 = function () {
        //     // File or Blob named mountains.jpg
        //     var storageRef = firebase.storage().ref("siswa/tes/file");
        //     var storage = $firebaseStorage(storageRef);
        //     var file = document.querySelector("#inputSkl").files[0];

        //     var metadata = {
        //         contentType: file.type
        //     }
        //     //Upload File
        //    //console.log(file);
        //     var uploadTask = storage.$put(file);
        //     $ionicLoading.show();
        //     uploadTask.$complete(function (snapshot) {
        //        //console.log(snapshot);
        //         storageRef.getDownloadURL().then(function(url) {
        //            //console.log(url);
        //           }).catch(function(error) {
        //             // Handle any errors
        //           });
        //     })
        //     $ionicLoading.hide();
        // }
        var map;
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var harga = 1.7;

        map = new google.maps.Map(document.getElementById('map'), {
            center: {
                lat: -7.960996,
                lng: 112.618634
            },
            zoom: 16
        });
        directionsDisplay.setMap(map);

        // var start = document.getElementById('start');
        // var searchStart = new google.maps.places.SearchBox(start);

        var end = document.getElementById('end');
        // var end = 'SMP Negeri 1 Singaraja, Jalan Gajah Mada, Banjar Jawa, Buleleng Regency, Bali, Indonesia';
        var searchEnd = new google.maps.places.SearchBox(end);

        var detail = document.getElementById('detail');

        var pesanStart = document.getElementById('pesan-btn');

        function findRoute() {
            var startAddress = 'Jalan Gajah Mada No.80, Banjar Jawa, Buleleng Regency, Bali, Indonesia';
            //console.log(startAddress);
            var endAddress = 'SMP Negeri 1 Singaraja, Jalan Gajah Mada, Banjar Jawa, Buleleng Regency, Bali, Indonesia';
            var request = {
                origin: startAddress,
                destination: endAddress,
                travelMode: 'DRIVING'
            };
            directionsService.route(request, function (result, status) {
                if (status == 'OK') {
                    directionsDisplay.setDirections(result);
                    ////console.log(result);
                    ////console.log(result.routes[0].legs[0].distance.text);
                    ////console.log(result.routes[0].legs[0].distance.value);

                    document.getElementById('distance').innerHTML = result.routes[0].legs[0].distance.text;
                    document.getElementById('duration').innerHTML = result.routes[0].legs[0].duration.text;
                    document.getElementById('price').innerHTML = 'Rp' + result.routes[0].legs[0].distance.value *
                        harga;

                    detail.style.display = 'block';
                } else {
                    detail.style.display = 'none';
                    // alert('Petunjuk arah gagal dimuat, masukkan alamat yang benar!');
                    $('#modal_alert_map_arah').modal();
                }
            });
        }

        findRoute();

        // pesan.addEventListener("click", function (event) {

        //     // if (start.value.trim() != "" && end.value.trim() != "") {
        //     //     event.preventDefault();

        //     // }
        // });
    }])