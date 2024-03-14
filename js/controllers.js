angular.module('app.controllers', [])

    .controller('menuAdminCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter) {

        $scope.idAdmin = localStorage.getItem('idAdmin');
        $scope.namaAdmin = localStorage.getItem('namaAdmin');
        $scope.emailAdmin = localStorage.getItem('emailAdmin');
        $scope.hakAkses = localStorage.getItem('hakAkses');
        $scope.uidAdmin = localStorage.getItem('uidAdmin');

        if (!$scope.idAdmin) {
            $state.go('welcome');
        }

        var akses = firebase.database().ref("adminDinasPendidikan/" + $scope.idAdmin);
        $ionicLoading.show();
        akses.on("value", function (snapshot) {
            $ionicLoading.hide();
            $scope.ijinkanAkses = snapshot.val().ijinkanAkses;
        })

        $scope.logoutAdmin = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout Application',
                template: 'Are you sure to logout this apps?',
                okType: 'button-positive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    localStorage.removeItem('idAdmin');
                    localStorage.removeItem('namaAdmin');
                    localStorage.removeItem('emailAdmin');
                    localStorage.removeItem('hakAkses');
                    localStorage.removeItem('uidAdmin');
                    localStorage.clear();
                    $state.go("welcome");
                } else {
                    console.log('You are not sure');
                }
            }).then(function (resp) {

            })
        };
    }])

    .controller('menuSiswaCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter) {

        $scope.idPenggunaSiswa = localStorage.getItem('idPenggunaSiswa');
        $scope.namaPenggunaSiswa = localStorage.getItem('namaPenggunaSiswa');
        $scope.emailSiswa = localStorage.getItem('emailSiswa');
        $scope.uidSiswa = localStorage.getItem('uidSiswa');
        $scope.idSekolahSiswa = localStorage.getItem('idSekolahSiswa');
        $scope.jenjangSiswa = localStorage.getItem('jenjangSiswa');
        $scope.idProvinsiSiswa = localStorage.getItem('idProvinsiSiswa');
        $scope.idKotaKabupatenSiswa = localStorage.getItem('idKotaKabupatenSiswa');
        $scope.idKecamatanSiswa = localStorage.getItem('idKecamatanSiswa')

        if (!$scope.idPenggunaSiswa) {
            $state.go('welcome');
        }

        // var versiAplikasiUser = "0.0.11";
        // // VERSI APLIKASI
        // var versiAplikasi = firebase.database().ref("versiAplikasi/1");
        // versiAplikasi.on("value", function (snapshot) {
        //     $scope.update = snapshot.val();
        //     $scope.versiAplikasiMaster = snapshot.val().versi;
        //     // IJINKAN AKSES
        //     if (versiAplikasiUser === $scope.versiAplikasiMaster) {
        //         $scope.akses = true;
        //     }
        //     else {
        //         $scope.akses = false;
        //     }
        // });

        var akses = firebase.database(appSiswa).ref("dataSiswa/" + $scope.idPenggunaSiswa);
        $ionicLoading.show();
        akses.on("value", function (snapshot) {
            $ionicLoading.hide();
            $scope.ijinkanPenggunaanAplikasi = snapshot.val().ijinkanPenggunaanAplikasi;
            console.log(snapshot.val())
        })

        $scope.logoutSiswa = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout Application',
                template: 'Are you sure to logout this apps?',
                okType: 'button-positive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    localStorage.removeItem('idPenggunaSiswa');
                    localStorage.removeItem('namaPenggunaSiswa');
                    localStorage.removeItem('emailSiswa');
                    localStorage.removeItem('uidSiswa');
                    localStorage.removeItem('idSekolahSiswa');
                    localStorage.removeItem('jenjangSiswa');
                    localStorage.removeItem('idProvinsiSiswa');
                    localStorage.removeItem('idKotaKabupatenSiswa');
                    localStorage.removeItem('idKecamatanSiswa');
                    localStorage.clear();
                    $state.go("welcome");
                } else {
                    console.log('You are not sure');
                }
            }).then(function (resp) {

            })
        };
    }])

    .controller('menuGuruCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter) {

        $scope.idGuru = localStorage.getItem('idGuru');
        $scope.namaGuru = localStorage.getItem('namaGuru');
        $scope.emailGuru = localStorage.getItem('emailGuru');
        $scope.uidGuru = localStorage.getItem('uidGuru');
        $scope.idSekolahGuru = localStorage.getItem('idSekolahGuru');
        $scope.jenjangGuru = localStorage.getItem('jenjangGuru');
        $scope.idProvinsiGuru = localStorage.getItem('idProvinsiGuru');
        $scope.idKotaKabupatenGuru = localStorage.getItem('idKotaKabupatenGuru');
        $scope.idKecamatanGuru = localStorage.getItem('idKecamatanGuru');

        if (!$scope.idGuru) {
            $state.go('welcome');
        }

        // var versiAplikasiUser = "0.0.11";
        // // VERSI APLIKASI
        // var versiAplikasi = firebase.database().ref("versiAplikasi/1");
        // versiAplikasi.on("value", function (snapshot) {
        //     $scope.update = snapshot.val();
        //     $scope.versiAplikasiMaster = snapshot.val().versi;
        //     // IJINKAN AKSES
        //     if (versiAplikasiUser === $scope.versiAplikasiMaster) {
        //         $scope.akses = true;
        //     }
        //     else {
        //         $scope.akses = false;
        //     }
        // });

        var akses = firebase.database(appGuru).ref("dataGuru/" + $scope.idGuru);
        $ionicLoading.show();
        akses.on("value", function (snapshot) {
            $ionicLoading.hide();
            $scope.ijinPenggunaanAplikasi = snapshot.val().ijinPenggunaanAplikasi;
        });

        $scope.logoutGuru = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout Application',
                template: 'Are you sure to logout this apps?',
                okType: 'button-positive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    localStorage.removeItem('idGuru');
                    localStorage.removeItem('namaGuru');
                    localStorage.removeItem('emailGuru');
                    localStorage.removeItem('uidGuru');
                    localStorage.removeItem('idSekolahGuru');
                    localStorage.removeItem('jenjangGuru');
                    localStorage.removeItem('idProvinsiGuru');
                    localStorage.removeItem('idKotaKabupatenGuru');
                    localStorage.removeItem('idKecamatanGuru')
                    localStorage.clear();
                    $state.go("welcome");
                } else {
                    console.log('You are not sure');
                }
            }).then(function (resp) {

            })
        };
    }])

    .controller('menuSekolahCtrl', ['$scope', '$stateParams', '$firebaseArray', '$firebaseObject', '$ionicPopup', '$ionicLoading', '$state', '$ionicModal', '$ionicActionSheet', '$timeout', '$filter', function ($scope, $stateParams, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $state, $ionicModal, $ionicActionSheet, $timeout, $filter) {

        $scope.idPenggunaSekolah = localStorage.getItem('idPenggunaSekolah');
        $scope.idSekolah = localStorage.getItem('idSekolah');
        $scope.namaPenggunaSekolah = localStorage.getItem('namaPenggunaSekolah');
        $scope.jenjangSekolah = localStorage.getItem('jenjangSekolah');
        $scope.namaSekolah = localStorage.getItem('namaSekolah');
        $scope.uidSekolah = localStorage.getItem('uidSekolah');
        $scope.idProvinsiSekolah = localStorage.getItem('idProvinsiSekolah');
        $scope.idKotaKabupatenSekolah = localStorage.getItem('idKotaKabupatenSekolah');
        $scope.idKecamatanSekolah = localStorage.getItem('idKecamatanSekolah')

        if (!$scope.idPenggunaSekolah) {
            $state.go('welcome');
        }

        var akses = firebase.database().ref("adminSekolah/" + $scope.idPenggunaSekolah);
        $ionicLoading.show();
        akses.on("value", function (snapshot) {
            $ionicLoading.hide();
            $scope.aksesAplikasi = snapshot.val().aksesAplikasi;
        })

        $scope.logoutSekolah = function () {

            var confirmPopup = $ionicPopup.confirm({
                title: 'Logout Application',
                template: 'Are you sure to logout this apps?',
                okType: 'button-positive'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    localStorage.removeItem('idPenggunaSekolah');
                    localStorage.removeItem('idSekolah');
                    localStorage.removeItem('namaPenggunaSekolah');
                    localStorage.removeItem('jenjangSekolah');
                    localStorage.removeItem('namaSekolah');
                    localStorage.removeItem('uidSekolah');
                    localStorage.removeItem('idProvinsiSekolah');
                    localStorage.removeItem('idKotaKabupatenSekolah');
                    localStorage.removeItem('idKecamatanSekolah');
                    localStorage.clear();
                    $state.go("welcome");
                } else {
                    console.log('You are not sure');
                }
            }).then(function (resp) {

            })
        };
    }])


