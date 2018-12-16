-- phpMyAdmin SQL Dump
-- version 4.4.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 16, 2018 at 04:57 PM
-- Server version: 5.6.26
-- PHP Version: 5.6.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bantu_desa`
--

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE IF NOT EXISTS `articles` (
  `id_artikel` varchar(25) COLLATE utf8_bin NOT NULL,
  `judul_artikel` varchar(100) COLLATE utf8_bin NOT NULL,
  `isi_artikel` text COLLATE utf8_bin NOT NULL,
  `deskripsi_singkat` text COLLATE utf8_bin,
  `topik` varchar(50) COLLATE utf8_bin NOT NULL,
  `foto` varchar(150) COLLATE utf8_bin DEFAULT NULL,
  `tanggal_buat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `can_comment` tinyint(1) NOT NULL,
  `id_user` varchar(25) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id_artikel`, `judul_artikel`, `isi_artikel`, `deskripsi_singkat`, `topik`, `foto`, `tanggal_buat`, `can_comment`, `id_user`) VALUES
('5aea8dd37175c4bbb00e6193', 'Panen Desa Besar-Besaran', 'Kegiatan gotong royong dimulai pagi hingga pukul 12 belas siang. Perangkat Desa bersama warga membersihkan lingkungan desa untuk menciptakan kebersihan dan keindahan, baik membersihkan saluran dan lorong-lorong masuk ke rumah warga maupun meunasah (surau) sebagai tempat ibadah yang paling banyak didatangi warga menjelang datangnya bulan suci ramadhan.\\n“Kegiatan gotong-royong bersama merupakan tanggung jawab kami bersama. Apalagi menjelang masuk bulan suci ramadhan, Meunasah adalah salah satu tempat yang paling banyak dan sering didatangi masyarakat untuk beribadah,” kata Tgk. Nurdin Saad selaku Imam Meunasah Gampong Pulo Panjoe.\\nSelain melaksanakan kegiatan kebersihan, Desa (Gampong) juga mengoptimalkan suplai air bersih melalui sumur bor desa dan memperbaiki lampu penerangan jalan dalam desa untuk memudahkan masyarakat dalam beribadah.\\n“Selain membersihkan lingkungan, kami juga memperbaiki lampu jalan yang sudah rusak beserta mengoptimalkan penyuplaian air beraih melalui sumur bor desa kepada warga,” tambah Sukardi sebagai Kepala Urusan Pembangunan.\\nDengan demikian, saat warga masyarakat akan merasa nyaman dan khusyu’ dalam beribadah nantinya. tutupnya.\\nSeperti kita ketahui, bulan puasa tahun ini jatuh pada tanggal tujuh mei, tepatnya Sabtu pekan ini. (Cekdin)', 'Menjelang Ramadhan, warga Desa Wisata Malangan melakukan panen secara besar-besaran. Simak artikel berikut untuk mengetahui lebih lanjut', 'Ramadhan', '/uploads/img/articles/article1.jpg', '2018-11-18 00:55:09', 1, '5ace22c89029d318c0565c68'),
('5b3452cc8ae9710a04164929', 'Artikel Kedua', 'var db = req.con;\r\n	db.query(''SELECT * FROM articles WHERE id_artikel=''+req.params.id, function(err,article){\r\n		if(err) throw err;\r\n		if(!article){\r\n    		res.render(''article'', {message: ''Article not found''});\r\n    	}\r\n    	res.render(''article'', {article:article});\r\n	});', 'Deskripsi singkat dari artikel dua', 'Irigasi', '/uploads/img/articles/article2.jpg', '2018-11-18 01:22:35', 1, '5ace22c89029d318c0565c68');

-- --------------------------------------------------------

--
-- Table structure for table `desa`
--

CREATE TABLE IF NOT EXISTS `desa` (
  `id_desa` int(11) NOT NULL,
  `nama_desa` varchar(50) NOT NULL,
  `lokasi_desa` varchar(100) NOT NULL,
  `tanggal_buat` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `foto_desa` varchar(150) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `desa`
--

INSERT INTO `desa` (`id_desa`, `nama_desa`, `lokasi_desa`, `tanggal_buat`, `foto_desa`, `id_user`) VALUES
(1, 'Desa sukamaju', 'Kecamatan sabi, provinsi jawa barat', '2018-11-30 17:00:00', '', 3),
(2, 'Desa gasuka mundur', 'Kecamatan bisa, provinsi jawa barat', '2018-12-01 18:00:00', '', 4);

-- --------------------------------------------------------

--
-- Table structure for table `peserta`
--

CREATE TABLE IF NOT EXISTS `peserta` (
  `id_sayembara` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `subtopik` varchar(25) NOT NULL,
  `tgl_kirim` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_proposal` varchar(25) NOT NULL,
  `favorite` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `peserta`
--

INSERT INTO `peserta` (`id_sayembara`, `id_user`, `subtopik`, `tgl_kirim`, `file_proposal`, `favorite`) VALUES
(1, 1, '', '2018-12-08 04:16:52', '', 0),
(1, 2, '', '2018-12-08 04:16:52', '', 0),
(1, 3, '', '2018-12-08 04:16:52', '', 0),
(1, 4, '', '2018-12-08 04:16:52', '', 0),
(1, 5, '', '2018-12-08 04:16:52', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `sayembara`
--

CREATE TABLE IF NOT EXISTS `sayembara` (
  `id_sayembara` int(11) NOT NULL,
  `id_desa` int(11) NOT NULL,
  `judul_sayembara` varchar(25) NOT NULL,
  `topik` varchar(25) NOT NULL,
  `deskripsi_singkat` varchar(50) NOT NULL,
  `isi_sayembara` text NOT NULL,
  `tanggal_awal` date NOT NULL,
  `tanggal_akhir` date NOT NULL,
  `foto_sayembara` varchar(150) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `sayembara`
--

INSERT INTO `sayembara` (`id_sayembara`, `id_desa`, `judul_sayembara`, `topik`, `deskripsi_singkat`, `isi_sayembara`, `tanggal_awal`, `tanggal_akhir`, `foto_sayembara`) VALUES
(1, 1, 'Sanitasi sungai ciliwung', 'Infrastruktur', 'Butuh ide untuk sanitasi sungai ciliwung', 'Dibutuhkan ide untuk menciptakan sungai ciliwung yang bersih dan jernih', '2018-12-01', '2018-12-31', ''),
(2, 2, 'Pemanfaatan danau abot', 'Pariwisata', 'Butuh ide untuk memanfaatkan danau abot', 'Danau abot yang indah dan luas belum dimanfaatkan nih. Saya butuh ide kira-kira diapakan ya?', '2018-12-05', '2019-02-20', ''),
(3, 1, 'Sayembara 1', 'Infrastruktur', 'Ini adalah sayembara tentang infrastruktur', 'Ini adalah sayembara tentang infrastruktur', '2018-12-03', '2018-12-10', ''),
(4, 1, 'Sayembara 2', 'Pariwisata', 'Ini adalah sayembara tentang pariwisata', 'Ini adalah sayembara tentang pariwisata', '2018-09-11', '2018-12-31', '');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id_user` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(60) NOT NULL,
  `email` varchar(25) NOT NULL,
  `name` varchar(25) NOT NULL,
  `usercode` int(11) NOT NULL,
  `id_desa` int(11) DEFAULT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `username`, `password`, `email`, `name`, `usercode`, `id_desa`) VALUES
(1, 'test0', 'test0', 'test0@test.com', 'test_user_0', 0, 0),
(2, 'test1', 'test1', 'test1@test.com', 'test_user_1', 1, 0),
(3, 'walidesa1', 'walidesa1', 'walidesa1@gmail.com', 'Wali desa satu', 1, 1),
(4, 'walidesa2', 'walidesa2', 'walidesa2@gmail.com', 'Wali desa dua', 1, 2),
(5, 'admin1', 'admin1', 'admin1@gmail.com', 'admin satu', 0, NULL),
(6, 'userbiasa1', 'userbiasa1', 'userbiasa1@gmail.com', 'user biasa satu', 2, NULL),
(7, 'kreator1', 'kreator1', 'kreator1@gmail.com', 'kreator satu', 3, NULL),
(8, 'asd', '$2a$10$di8qlKKOfcJo3Ck5tWyn8eBvn3Vdk5lqsPlYePF.ricTtihGfV12.', 'asd@asd.asd', 'asd', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id_artikel`);

--
-- Indexes for table `desa`
--
ALTER TABLE `desa`
  ADD PRIMARY KEY (`id_desa`);

--
-- Indexes for table `peserta`
--
ALTER TABLE `peserta`
  ADD PRIMARY KEY (`id_sayembara`,`id_user`);

--
-- Indexes for table `sayembara`
--
ALTER TABLE `sayembara`
  ADD PRIMARY KEY (`id_sayembara`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `desa`
--
ALTER TABLE `desa`
  MODIFY `id_desa` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `sayembara`
--
ALTER TABLE `sayembara`
  MODIFY `id_sayembara` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
