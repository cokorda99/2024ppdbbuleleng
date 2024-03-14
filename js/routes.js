angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
    // PENGGUNA ( SISWA / ORANG TUA)
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'templates/auth/welcome/welcome.html',
        controller: 'welcomeCtrl'
      })

      .state('registrasiSiswa', {
        url: '/registrasiSiswa',
        templateUrl: 'templates/auth/registrasi/registrasi.html',
        controller: 'registrasiSiswaCtrl'
      })

      .state('dashboard', {
        url: '/dashboard',
        params: {
          uid: "",
          nama: "",
          nisn: "",
        },
        templateUrl: 'templates/user/dashboard/dashboard.html',
        controller: 'dashboardCtrl'
      })

      .state('pendaftaran_ppdb', {
        url: '/pendaftaran_ppdb',
        params: {
          uid: "",
          nama: "",
          nisn: "",
        },
        templateUrl: 'templates/user/pendaftaran/pendaftaran.html',
        controller: 'pendaftaranppdbCtrl'
      })


      .state('pendaftaran_khusus', {
        url: '/pendaftaran_khusus',
        params: {
          uid: "",
          nama: "",
          nisn: "",
        },
        templateUrl: 'templates/user/pendaftaran/pendaftaran_khusus.html',
        controller: 'pendaftaranKhususCtrl'
      })

      .state('pengumuman', {
        url: '/pengumuman',
        templateUrl: 'templates/user/pengumuman/pengumuman.html',
        controller: 'pengumumanCtrl'
      })

      .state('pengaturanUser', {
        url: '/pengaturanUser',
        templateUrl: 'templates/user/pengaturan/pengaturan.html',
        controller: 'pengaturanUserCtrl'
      })

      // AUTH ADMIN
      .state('loginAdmin', {
        url: '/loginadmin',
        templateUrl: 'templates/admin/auth/login.html',
        controller: 'loginAdminCtrl'
      })

      .state('registrasiAdmin', {
        url: '/registrasiAdmin',
        templateUrl: 'templates/admin/auth/registrasi.html',
        controller: 'registrasiAdminCtrl'
      })
      
      // ADMIN SD
      .state('berandaAdminSd', {
        url: '/berandaAdminSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sd/beranda/beranda.html',
        controller: 'berandaAdminSdCtrl'
      })

      .state('dataSiswaSd', {
        url: '/dataSiswaSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sd/data_siswa/data_siswa.html',
        controller: 'dataSiswaSdCtrl'
      })

      .state('dataSiswaterdaftarSd', {
        url: '/dataSiswaterdaftarSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sd/data_siswa/siswa_terdaftar.html',
        controller: 'dataSiswaSdterdaftarCtrl'
      })
      .state('dataSiswaDiterimaSd', {
        url: '/dataSiswaDiterimaSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sd/data_siswa/siswa_diterima.html',
        controller: 'dataSiswaSdDiterimaCtrl'
      })

      .state('pengaturanAdminSd', {
        url: '/pengaturanAdminSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sd/pengaturan/pengaturan_admin.html',
        controller: 'EditAdminSdCtrl'
      })

      // ADMIN SEKOLAH
      .state('berandaAdminSekolah', {
        url: '/berandaAdminSekolah',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/beranda/beranda.html',
        controller: 'berandaAdminSekolahCtrl'
      })
      .state('dataPendaftar', {
        url: '/dataPendaftar',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_pendaftar/data_pendaftar.html',
        controller: 'dataPendaftarCtrl'
      })
      .state('dataPendaftarZonasi', {
        url: '/dataPendaftarZonasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_pendaftar/data_pendaftar_zonasi.html',
        controller: 'dataPendaftarZonasiCtrl'
      })
      .state('dataPendaftarAfirmasi', {
        url: '/dataPendaftarAfirmasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_pendaftar/data_pendaftar_afirmasi.html',
        controller: 'dataPendaftarAfirmasiCtrl'
      })
      .state('dataPendaftarPrestasi', {
        url: '/dataPendaftarPrestasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_pendaftar/data_pendaftar_prestasi.html',
        controller: 'dataPendaftarPrestasiCtrl'
      })
      .state('dataPendaftarPerpindahan', {
        url: '/dataPendaftarPerpindahan',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_pendaftar/data_pendaftar_perpindahan.html',
        controller: 'dataPendaftarPerpindahanCtrl'
      })
      .state('dataPendaftartersalurkan', {
        url: '/dataPendaftartersalurkan',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_pendaftar/data_siswaTersalurkan.html',
        controller: 'dataPendaftarTersalurkanCtrl'
      })
      .state('PengaturanAdminSekolah', {
        url: '/PengaturanAdminSekolah',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/pengaturan/pengaturan.html',
        controller: 'PengaturanAdminSekolahCtrl'
      })
      .state('EditAdminSekolah', {
        url: '/EditAdminSekolah',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/pengaturan/pengaturan_admin.html',
        controller: 'EditAdminSekolahCtrl'
      })
      .state('EditDataSekolah', {
        url: '/EditDataSekolah',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/pengaturan/pengaturan_sekolah.html',
        controller: 'EditDataSekolahCtrl'
      })

      .state('dataRankingSekolahZonasi', {
        url: '/dataRankingSekolahZonasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_ranking/data_ranking_zonasi.html',
        controller: 'dataRankingSekolahZonasiCtrl'
      })

      .state('dataRankingSekolahAfirmasi', {
        url: '/dataRankingSekolahAfirmasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_ranking/data_ranking_afirmasi.html',
        controller: 'dataRankingSekolahAfirmasiCtrl'
      })

      .state('dataRankingSekolahPerpindahan', {
        url: '/dataRankingSekolahPerpindahan',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_ranking/data_ranking_perpindahan.html',
        controller: 'dataRankingSekolahPerpindahanCtrl'
      })

      .state('dataRankingSekolahPrestasi', {
        url: '/dataRankingSekolahPrestasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_ranking/data_ranking_prestasi.html',
        controller: 'dataRankingSekolahPrestasiCtrl'
      })

      .state('dataSiswaluarrayon', {
        url: '/dataSiswaluarrayon',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/data_siswa/luar_rayon.html',
        controller: 'dataSiswaluarrayonCtrl'
      })

      .state('siswaZonasi', {
        url: '/siswaZonasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_sekolah/siswaZonasi/siswaZonasi.html',
        controller: 'siswaZonasiCtrl'
      })


      // ADMIN SUPER
      .state('berandaAdminSuper', {
        url: '/berandaAdminSuper',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/beranda/beranda.html',
        controller: 'berandaAdminSuperCtrl'
      })

      .state('dataAdmin', {
        url: '/dataAdmin',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_admin/jenis_admin.html',
        controller: 'dataAdminCtrl'
      })

      .state('dataSekolah', {
        url: '/dataSekolah',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_sekolah/data_sekolah.html',
        controller: 'dataSekolahCtrl'
      })

      .state('dataSekolahSmp', {
        url: '/dataSekolahSmp',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_sekolah/data_sekolah_smp.html',
        controller: 'dataSekolahSmpCtrl'
      })

      .state('dataSekolahSd', {
        url: '/dataSekolahSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_sekolah/data_sekolah_sd.html',
        controller: 'dataSekolahSdCtrl'
      })

      .state('pengaturanAdminSuper', {
        url: '/pengaturanAdminSuper',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/pengaturan/pengaturan.html',
        controller: 'pengaturanAdminSuperCtrl'
      })


      .state('editAdminSuper', {
        url: '/editAdminSuper',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/pengaturan/pengaturan_admin.html',
        controller: 'EditAdminSuperCtrl'
      })

      .state('dataSiswa', {
        url: '/dataSiswa',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_siswa/data_siswa.html',
        controller: 'dataSiswaCtrl'
      })


      .state('dataSiswaBelumDaftar', {
        url: '/dataSiswaBelumDaftar',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_siswa/data_siswaBelumDaftar.html',
        controller: 'dataSiswaBelumDaftarCtrl'
      })

      .state('dataSiswaPenyaluran', {
        url: '/dataSiswadataSiswaPenyaluran',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_siswa/data_siswaPenyaluran.html',
        controller: 'dataSiswaPenyaluranCtrl'
      })

      .state('dataSiswaLuarRayon', {
        url: '/dataSiswaLuarRayon',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_siswa/data_siswaLuarRayon.html',
        controller: 'dataSiswaLuarRayonCtrl'
      })



      
      .state('dataPendaftarAdminSuper', {
        url: '/dataPendaftarAdminSuper',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/data_pendaftar.html',
        controller: 'dataPendaftarAdminSuperCtrl'
      })

      .state('dataPendaftarAdminSuperMenu', {
        url: '/dataPendaftarAdminSuperMenu',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/data_pendaftar_menu.html',
        controller: 'dataPendaftarSMPAdminSuperMenuCtrl'
      })

      .state('dataAdminSuperDinas', {
        url: '/dataAdminSuperDinas',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_admin/dataAdminSuper.html',
        controller: 'dataAdminSuperDinasCtrl'
      })


      .state('dataAdminSmp', {
        url: '/dataAdminSmp',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_admin/dataAdminSMP.html',
        controller: 'dataAdminSmpCtrl'
      })

      .state('dataAdminSd', {
        url: '/dataAdminSd',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_admin/dataAdminSD.html',
        controller: 'dataAdminSdCtrl'
      })

      
      .state('dataPendaftarSMPAdminSuper', {
        url: '/dataPendaftarSMPAdminSuper',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/datapendaftarSMP.html',
        controller: 'dataPendaftarSMPAdminSuperCtrl'
      })

      .state('dataPendaftarSMPAdminSuperZonasi', {
        url: '/dataPendaftarSMPAdminSuperZonasi',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/datapendaftarSMPZonasi.html',
        controller: 'dataPendaftarSMPAdminSuperZonasiCtrl'
      })
      .state('dataPendaftarSMPAdminSuperAfirmasi', {
        url: '/dataPendaftarSMPAdminSuperAfirmasi',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/datapendaftarSMPAfirmasi.html',
        controller: 'dataPendaftarSMPAdminSupeAfirmasirCtrl'
      })
      .state('dataPendaftarSMPAdminSuperPerpindahan', {
        url: '/dataPendaftarSMPAdminSuperPerpindahan',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/datapendaftarSMPPerpindahan.html',
        controller: 'dataPendaftarSMPAdminSuperPerpindahanCtrl'
      })
      .state('dataPendaftarSMPAdminSuperPrestai', {
        url: '/dataPendaftarSMPAdminSuper',
        params: {
          idSekolah: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/datapendaftarSMPPrestasi.html',
        controller: 'dataPendaftarSMPAdminSuperPrestasiCtrl'
      })

      .state('dataPendaftarSeluruhSMP', {
        url: '/dataPendaftarSeluruhSMP',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/data_pendaftar/data_pendaftarSeluruh.html',
        controller: 'dataPendaftarSeluruhSMPCtrl'
      })

      .state('dataRankingSeluruhZonasi', {
        url: '/dataRankingSeluruhZonasi',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/perangkingan/perangkinganZonasi.html',
        controller: 'dataPendaftarPerangkinganZonasiCtrl'
      })


      .state('dataRankingSeluruhJalur', {
        url: '/dataRankingSeluruhJalur',
        params: {
          idUser: "",
        },
        templateUrl: 'templates/admin/admin_super/perangkingan/perangkinganJalur.html',
        controller: 'dataPendaftarPerangkinganJalurCtrl'
      })



      // DAFTAR SISWA DARI TK KE SD

      .state('pendaftaranSiswaSD', {
        url: '/pendaftaranSiswaSD',
        templateUrl: 'templates/daftarSD/pendaftaran.html',
        controller: 'pendaftaranSiswaSDCtrl'
      })

      .state('registrasiSiswaSD', {
        url: '/registrasiSiswaSD',
        templateUrl: 'templates/daftarSD/registrasi.html',
        controller: 'registrasiSiswaSDCtrl'
      })

      
      .state('calonSiswaSD', {
        url: '/calonSiswaSD',
        templateUrl: 'templates/admin/admin_sd/calon_siswa/calon_siswa.html',
        controller: 'calonsiswaSdCtrl'
      })

      .state('rankSd', {
        url: '/rankSd',
        templateUrl: 'templates/admin/admin_sd/calon_siswa/rank_calon_siswa.html',
        controller: 'rank_calonsiswaSdCtrl'
      })





      



    
    $urlRouterProvider.otherwise('/welcome')


  });