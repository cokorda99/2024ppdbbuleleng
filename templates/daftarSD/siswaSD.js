angular.module('app.pendaftaranSD', [])
    .controller('pendaftaranSiswaSDCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $rootScope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        var cekBukaPPDB = firebase.database().ref('pengaturan').child('buka_ppdbSD');
        cekBukaPPDB.on('value', (dataSnapShot) => {
            $scope.cekBukaPPDBSD = dataSnapShot.val().aktif;
        })
        // localStorage.clear();
        $scope.ChecknikSiswa = function () {
            $ionicLoading.show();
            var nikSiswa = document.getElementById("nikSiswaSD").value;
            console.log(nikSiswa)

            if (nikSiswa != '') {
                if (nikSiswa.length > 8) {
                    firebase.database().ref('datasiswa_daftarSD/' + nikSiswa).on('value', function (snapshot) {
                        if (snapshot.val()) {
                            $ionicLoading.hide();
                            // console.log(snapshot.val().statusDaftarAwal);
                            console.log('Lanjut Registrasi');
                            localStorage.setItem('nikSiswa', nikSiswa);
                            $state.go('registrasiSiswaSD');
                        } else {
                            $ionicLoading.hide();
                            localStorage.setItem('nikSiswa', nikSiswa);
                            console.log('Belum Terdaftar dan harus signUp');
                            localStorage.setItem('nik', nikSiswa);
                            firebase.database().ref('datasiswa_daftarSD/' + nikSiswa).set({
                                nikSiswa: nikSiswa,
                                statusDaftarAwal: false,
                                statusPilihJalur: false,
                                statusVerif: false
                            });
                            $state.go('registrasiSiswaSD');
                        }
                    });
                } else {
                    $ionicLoading.hide();
                    Swal.fire({
                        icon: 'error',
                        title: 'ERROR',
                        text: 'nikSiswa Tidak Sesuai Format',
                    })
                }
            } else {
                $ionicLoading.hide();
                Swal.fire({
                    icon: 'error',
                    title: 'ERROR',
                    text: 'nikSiswa Tidak Boleh kosong',
                })
            }

        }

    }])
    .controller('registrasiSiswaSDCtrl', ['$scope', '$rootScope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', '$firebaseAuth', '$firebaseStorage', function ($scope, $rootScope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter, $firebaseAuth, $firebaseStorage) {

        $scope.form = {
            "idKecamatan": "",
            "idDesa": "",
            "idBanjar": "",
            "jenisAsal": "",
            "pilihSekolah": "",
        }
        var refKecamatan = firebase.database().ref("kecamatan");
        $scope.dataKecamatan = $firebaseArray(refKecamatan);

        $scope.getIdKecamatan = function () {
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
            $scope.dataDesa = $firebaseArray(refDesa);
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
                // $scope.sklhNama1 = response[0].nama_smp;
                // $scope.sklhId1 = response[0].id_smp;
                // $scope.sklhAlamat1 = response[0].alamat_smp;
            });
            // var refBanjar = firebase.database().ref("banjar").orderByChild("id_desa").equalTo(idDesa);
            // // var refDesa = firebase.database().ref("desa");
            // $scope.dataBanjar = $firebaseArray(refBanjar);
        }
        // $scope.getIdBanjar = function () {
        //     var idBanjar = $scope.form.idBanjar;
        //     $scope.idBanjar = $scope.form.idBanjar;
        //     //Get Nama Kecamatan
        //     var namaBanjar = firebase.database().ref("banjar").orderByChild("id_banjar").equalTo(idBanjar);
        //     var listNamaBanjar = $firebaseArray(namaBanjar);
        //     listNamaBanjar.$loaded().then(function (response) {
        //         $scope.namaBanjar = response[0].nama_banjar;
        //         $scope.id_desa = response[0].id_banjar;

        //         $scope.sklhNama1 = response[0].nama_smp;
        //         $scope.sklhId1 = response[0].id_smp;
        //         $scope.sklhAlamat1 = response[0].alamat_smp;
        //     });

        // }
        $scope.tk;
        $scope.pilihanjenisasal = function () {
            console.log($scope.form.jenisAsal);
        }

        $scope.pilihansekolah = function () {
            console.log($scope.form.pilihSekolah);
            if ($scope.form.pilihSekolah == '50100100') {
                $scope.namaSekolah = 'SD NEGERI 1 BANJAR JAWA'
            } else if ($scope.form.pilihSekolah == '50100153') {
                $scope.namaSekolah = 'SD NEGERI 3 BANJAR JAWA'
            } else if ($scope.form.pilihSekolah == '50100101') {
                $scope.namaSekolah = 'SD NEGERI 1 PAKET AGUNG'
            }
        }


        var nikSiswaGet = localStorage.getItem('nikSiswa');
        console.log(nikSiswaGet);

        firebase.database().ref('datasiswa_daftarSD/' + nikSiswaGet).on('value', function (snapshot) {
            // CEK STATUS
            $scope.statusDaftarAwalTampil = snapshot.val().statusDaftarAwal;
            $scope.statusPilihJalurTampil = snapshot.val().statusPilihJalur;
            $scope.statusVerifTampil = snapshot.val().statusVerif;

            // CEK ATRIBUT SISWA
            $scope.pilihSekolahSD = snapshot.val().namaSekolahPilihanSiswa;
            $scope.idSekolahPilihanSiswa = snapshot.val().idSekolahPilihanSiswa;
            $scope.checkGender = snapshot.val().jenis_kelaminSiswa;
            $scope.namaSiswa = snapshot.val().namaSiswa;
            $scope.tanggal_lahirSiswa = snapshot.val().tanggal_lahirSiswa;

            var forma = document.getElementById("pendaftaranform");
            var formb = document.getElementById("pilihjalurform");
            var formc = document.getElementById("buktiform");

            formb.style.display = "none";
            formc.style.display = "none";
            if ($scope.statusDaftarAwalTampil == true && $scope.statusPilihJalurTampil == false) {
                forma.style.display = "none";
                formb.style.display = "block";
                console.log('KONDISI 1');
                $scope.jalurSiswa = snapshot.val().jalurSiswa;
                $scope.pilihanSekolah = snapshot.val().namaSekolahPilihanSiswa;

            } else if ($scope.statusDaftarAwalTampil == true && $scope.statusPilihJalurTampil == true) {
                $scope.noPendaftaranSiswa = snapshot.val().noPendaftaranSiswa;
                $scope.jalurSiswa = snapshot.val().jalurSiswa;
                console.log('KONDISI 2');
                forma.style.display = "none";
                formb.style.display = "none";
                formc.style.display = "block";
            }
            else {
                forma.style.display = "block";
            }
        })

        document.getElementById("nikSiswa").value = nikSiswaGet;

        $scope.simpanDaftar = function () {

            var namaSiswa = document.getElementById("namaSiswa").value;
            var jenis_kelaminSiswa = document.getElementById("jenisKelaminSiswa").value
            var nisnSiswa = document.getElementById("nisnSiswa").value;
            var nikSiswa = document.getElementById("nikSiswa").value;
            var tglLahirSiswa = document.getElementById("tglLahirSiswa").value;
            var tempatLahirSiswa = document.getElementById("tempatLahirSiswa").value;
            var namaIbuSiswa = document.getElementById("namaibukandungSiswa").value;
            var noHpSiswa = document.getElementById('notelpSiswa').value;
            var nokkSiswa = document.getElementById('nokkSiswa').value;

            // UPLOAD BERKAS

            // ASAL TK / NON TK

            // PILIHAN SD 

            // JALUR
            var jalurSiswa = document.getElementById('jalurSiswa').value;
            var fileDokCheck = document.getElementById("inputKK").value;

            // var kordinatSiswa = document.getElementById("Alamatkoordinat").value;

            // KONDISI ASLI
            if (fileDokCheck.length != 0 && $scope.form.jenisAsal.length != 0 && namaSiswa.length != 0 && jenis_kelaminSiswa.length != 0 && tglLahirSiswa.length != 0 && tempatLahirSiswa.length != 0 && namaIbuSiswa.length != 0 && noHpSiswa.length != 0 && nokkSiswa.length != 0) {


                const swalDaftarAwal = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-primary ms-2',
                        cancelButton: 'btn btn-outline-secondary'
                    },
                    buttonsStyling: false
                })
                swalDaftarAwal.fire({
                    title: 'Lanjutkan Pendaftaran',
                    icon: 'success',
                    text: 'Pastikan Data Sudah Sesuai',
                    showCancelButton: true,
                    confirmButtonText: 'Lanjut Daftar',
                    reverseButtons: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        $ionicLoading.show();

                        if ($scope.form.jenisAsal == 'nonTK') {
                            var tk = '-';
                            var npsntk ='-'
                        } else {
                            var tk = document.getElementById('sekolahSiswa').value;
                            var npsntk = document.getElementById('npsnSiswa').value;
                        }


                        if (nisnSiswa.length == 0) {
                            nisnSiswa = '0'
                        }

                        // UPDATE DATA
                        firebase.database().ref('datasiswa_daftarSD/' + nikSiswa).update({
                            namaSiswa: namaSiswa,
                            jenis_kelaminSiswa: jenis_kelaminSiswa,
                            nisnSiswa: nisnSiswa,
                            nikSiswa: nikSiswa,
                            tanggal_lahirSiswa: tglLahirSiswa,
                            tempatLahirSiswa: tempatLahirSiswa,

                            namaIbuSiswa: namaIbuSiswa,
                            noHpSiswa: noHpSiswa,
                            jalurSiswa: jalurSiswa,

                            nokkSiswa: nokkSiswa,

                            asalSiswa: $scope.form.jenisAsal,
                            idSekolahPilihanSiswa: $scope.form.pilihSekolah,
                            namaSekolahPilihanSiswa: $scope.namaSekolah,

                            statusDaftarAwal: true,
                            statusPilihJalur: false,
                            statusVerif: false,

                            tk : tk,
                            npsntk : npsntk,
                        });

                        // File 
                        var storageRefDok = firebase.storage().ref("daftar_SD/" + nikSiswa + "/" + 'KK');
                        var storageDok = $firebaseStorage(storageRefDok);
                        var fileDok = document.getElementById("inputKK").files[0];

                        var metadata = {
                            contentType: fileDok.type
                        }
                        //Upload File
                        var uploadTask = storageDok.$put(fileDok);
                        $ionicLoading.show();
                        uploadTask.$complete(function (snapshot) {
                            //console.log(snapshot);
                            storageRefDok.getDownloadURL().then(function (url) {
                                //console.log(url);
                                var refAddFoto = firebase.database().ref('datasiswa_daftarSD/' + nikSiswa + '/fileKK')
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
                    }
                })

            } else {
                $ionicLoading.hide();
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Pastikan Data Terisi Lengkap',
                })
            }
        }

        $scope.DaftarZonasi = function () {
            $ionicLoading.show();
            console.log('DAFTAR ZONASI');
            var kordinatSiswa = document.getElementById('kordinatSiswaZonasi').value;
            // console.log(kordinatSiswa);

            if ($scope.idKecamatan != undefined && $scope.idDesa != undefined && kordinatSiswa.length != 0) {
                console.log('LENGKAP');
                const swalDaftarAwal = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-primary ms-2',
                        cancelButton: 'btn btn-outline-secondary'
                    },
                    buttonsStyling: false
                })
                swalDaftarAwal.fire({
                    title: 'Lanjutkan Pendaftaran',
                    icon: 'warning',
                    text: 'Pastikan Data Sudah Sesuai',
                    showCancelButton: true,
                    confirmButtonText: 'Lanjut Daftar',
                    reverseButtons: true
                }).then((result) => {

                    if (result.isConfirmed) {
                        $ionicLoading.show();
                        // UPDATE DATA
                        firebase.database().ref('datasiswa_daftarSD/' + nikSiswaGet).update({
                            noPendaftaranSiswa: 'zonasi/' + $scope.idSekolahPilihanSiswa + '/' + nikSiswaGet,
                            statusDaftarAwal: true,
                            statusPilihJalur: true,
                            statusVerif: false,

                            idKecamatanSiswa: $scope.idKecamatan,
                            namaKecamatanSiswa: $scope.namaKecamatan,
                            namaDesaSiswa: $scope.namaDesa,
                            idDesaSiswa: $scope.idDesa,
                        });
                        $ionicLoading.hide();
                    }
                })
            } else {
                $ionicLoading.hide();
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Pastikan Data Terisi Lengkap',
                })
            }
        }

        $scope.DaftarAfirmasi = function () {
            $ionicLoading.show();
            console.log('DAFTAR AFIRMASI');

            var kordinatSiswa = document.getElementById('kordinatSiswaZonasi').value;
            var fileAfirCheck = document.getElementById("inputberkasAfirmasi").value;
            // console.log(kordinatSiswa);

            if (fileAfirCheck.length != 0 && $scope.idKecamatan != undefined && $scope.idDesa != undefined && kordinatSiswa.length != 0) {
                console.log('LENGKAP');
                const swalDaftarAwal = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-primary ms-2',
                        cancelButton: 'btn btn-outline-secondary'
                    },
                    buttonsStyling: false
                })
                swalDaftarAwal.fire({
                    title: 'Lanjutkan Pendaftaran',
                    icon: 'warning',
                    text: 'Pastikan Data Sudah Sesuai',
                    showCancelButton: true,
                    confirmButtonText: 'Lanjut Daftar',
                    reverseButtons: true
                }).then((result) => {

                    if (result.isConfirmed) {
                        $ionicLoading.show();

                        // File 
                        var storageRefDokAfir = firebase.storage().ref("daftar_SD/" + nikSiswaGet + "/" + 'FileLain');
                        var storageDokAfir = $firebaseStorage(storageRefDokAfir);
                        var fileDokAfir = document.getElementById("inputberkasAfirmasi").files[0];

                        var metadata = {
                            contentType: fileDokAfir.type
                        }
                        //Upload File
                        var uploadTask = storageDokAfir.$put(fileDokAfir);
                        $ionicLoading.show();
                        uploadTask.$complete(function (snapshot) {
                            //console.log(snapshot);
                            storageRefDokAfir.getDownloadURL().then(function (url) {
                                //console.log(url);
                                var refAddFoto = firebase.database().ref('datasiswa_daftarSD/' + nikSiswaGet + '/filelain')
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

                        // UPDATE DATA
                        firebase.database().ref('datasiswa_daftarSD/' + nikSiswaGet).update({
                            noPendaftaranSiswa: 'afirmasi/' + $scope.idSekolahPilihanSiswa + '/' + nikSiswaGet,
                            statusDaftarAwal: true,
                            statusPilihJalur: true,
                            statusVerif: false,

                            idKecamatanSiswa: $scope.idKecamatan,
                            namaKecamatanSiswa: $scope.namaKecamatan,
                            namaDesaSiswa: $scope.namaDesa,
                            idDesaSiswa: $scope.idDesa,
                        });
                    }
                })
            } else {
                $ionicLoading.hide();
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Pastikan Data Terisi Lengkap',
                })
            }
        }

        $scope.DaftarPerpindahan = function () {
            console.log('DAFTAR PERPINDAHAN')

            var kordinatSiswa = document.getElementById('kordinatSiswaZonasi').value;
            var filePindahCheck = document.getElementById("inputberkasPerpindahan").value;
            // console.log(kordinatSiswa);

            if (filePindahCheck.length != 0 && $scope.idKecamatan != undefined && $scope.idDesa != undefined && kordinatSiswa.length != 0) {
                console.log('LENGKAP');
                const swalDaftarAwal = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn btn-primary ms-2',
                        cancelButton: 'btn btn-outline-secondary'
                    },
                    buttonsStyling: false
                })
                swalDaftarAwal.fire({
                    title: 'Lanjutkan Pendaftaran',
                    icon: 'warning',
                    text: 'Pastikan Data Sudah Sesuai',
                    showCancelButton: true,
                    confirmButtonText: 'Lanjut Daftar',
                    reverseButtons: true
                }).then((result) => {

                    if (result.isConfirmed) {
                        $ionicLoading.show();

                        // File 
                        var storageRefDokPindah = firebase.storage().ref("daftar_SD/" + nikSiswaGet + "/" + 'FileLain');
                        var storageDokPindah = $firebaseStorage(storageRefDokPindah);
                        var fileDokPindah = document.getElementById("inputberkasPerpindahan").files[0];

                        var metadata = {
                            contentType: fileDokPindah.type
                        }
                        //Upload File
                        var uploadTask = storageDokPindah.$put(fileDokPindah);
                        $ionicLoading.show();
                        uploadTask.$complete(function (snapshot) {
                            //console.log(snapshot);
                            storageRefDokPindah.getDownloadURL().then(function (url) {
                                //console.log(url);
                                var refAddFoto = firebase.database().ref('datasiswa_daftarSD/' + nikSiswaGet + '/filelain')
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


                        // UPDATE DATA
                        firebase.database().ref('datasiswa_daftarSD/' + nikSiswaGet).update({
                            noPendaftaranSiswa: 'perpindahan/' + $scope.idSekolahPilihanSiswa + '/' + nikSiswaGet,
                            statusDaftarAwal: true,
                            statusPilihJalur: true,
                            statusVerif: false,

                            idKecamatanSiswa: $scope.idKecamatan,
                            namaKecamatanSiswa: $scope.namaKecamatan,
                            namaDesaSiswa: $scope.namaDesa,
                            idDesaSiswa: $scope.idDesa,
                        });
                        // $ionicLoading.hide();
                    }
                })
            } else {
                $ionicLoading.hide();
                Swal.fire({
                    icon: 'warning',
                    title: 'Perhatian',
                    text: 'Pastikan Data Terisi Lengkap',
                })
            }
        }

        $scope.cetakBukti = function () {
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

    }])
