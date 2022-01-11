<?php

    $block1 = $_POST["altAgId1"];
    $block2 = $_POST["altAgId2"];
    $block3 = $_POST["altAgId3"];
    $block4 = $_POST["altAgId4"];
    $altagSayisi = $_POST["altAgSayisi"];

    //kontroller
    $hatalar = []; //hataları ekleme
    $sinifKontrolu = true; //ip aralık kontrolü
    $sinif = ""; //a-b-c
    if($block1 >= 192 && $block1 <= 223 && $altagSayisi >=1 && $altagSayisi <=64){
        $sinif = "C";
        $sinifKontrolu = true;
    }elseif($block1 >= 128 && $block1 <= 191 && $altagSayisi >=1 && $altagSayisi <= 16384){
        $sinif = "B";
        $sinifKontrolu = true;
    }elseif($block1 >= 1 && $block1 <= 126 && $altagSayisi >=1 && $altagSayisi <= 4194304){
        $sinif = "A";
        $sinifKontrolu = true;
    }else {
        $sinifKontrolu = false;
        array_push($hatalar, " 'Geçersiz Sınıf!' ");
    }

    //alt ağ maskesi hesaplama
    function altagMaskesiBul($altagSayisi){
        $bitSayisi = 0;
        while (true) {
            $altagSayisi = $altagSayisi/2; //alt ağ bit sayısı bulunuyor. (2^n=4 n=2) 11000000 = 2^7+2^6=192

            if ($bitSayisi == 8) { //256 dan büyük alt ağ sayısında bit değeri sıfırlanır
                $bitSayisi = 0;
            }
            $bitSayisi++;
            if ($altagSayisi == 1) {
                break;
            }
        }

        $altagSon = 0;
        $us = 7;
        for ($i=0; $i < $bitSayisi; $i++) { 
            $altagSon += pow(2, $us);
            $us--;
        }
        return $altagSon;
    }

    if($sinifKontrolu){
        //C sınıfı hesaplama
        if ($sinif == "C") {
            if($altagSayisi == 1){
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");

                $altagMaskesi = "Altag Maskesi: 255.255.255.0\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayisi = "Host Sayısı: 254\n";
                fwrite($cevapTxt, $hostSayisi);

                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);

                $network = "$block1.$block2.$block3.0\t\t";
                fwrite($cevapTxt, $network);
                $ilk = "$block1.$block2.$block3.1\t\t";
                fwrite($cevapTxt, $ilk);
                $son = "$block1.$block2.$block3.254\t\t";
                fwrite($cevapTxt, $son);
                $broadcast = "$block1.$block2.$block3.255\t\n";
                fwrite($cevapTxt, $broadcast);

                fclose($cevapTxt);
            }else {
                $ipSayisi = (256/$altagSayisi); //her ağ daki ip sayısı

                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");
                
                $altagMaske = altagMaskesiBul($altagSayisi);
                $altagMaskesi = "Altag Maskesi: 255.255.255.$altagMaske\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayi = $ipSayisi-2;
                $hostSayisi = "Host Sayısı: $hostSayi\n";
                fwrite($cevapTxt, $hostSayisi);

                $agNumarasi = "Ağ Numarası\t\t";
                fwrite($cevapTxt, $agNumarasi);
                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);
                
                for ($i=0; $i < $altagSayisi; $i++) { 
                    $agNo = "\t$i\t\t";
                    fwrite($cevapTxt, $agNo);

                    $net = $ipSayisi*$i;
                    $network = "$block1.$block2.$block3.$net\t\t";
                    fwrite($cevapTxt, $network);
                    $ilkIP = (($ipSayisi*$i)+1);
                    $ilk = "$block1.$block2.$block3.$ilkIP\t\t";
                    fwrite($cevapTxt, $ilk);
                    $sonIpadresi = (($ipSayisi*$i)+($ipSayisi-2));
                    $son = "$block1.$block2.$block3.$sonIpadresi\t\t";
                    fwrite($cevapTxt, $son);
                    $broad = ($ipSayisi*$i)+($ipSayisi-1);
                    $broadcast = "$block1.$block2.$block3.$broad\t\n";
                    fwrite($cevapTxt, $broadcast);
                }

                fclose($cevapTxt);
            }
        }
        //B sınıfı hesaplama
        elseif($sinif == "B"){
            if($altagSayisi == 1){
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");

                $altagMaskesi = "Altag Maskesi: 255.255.0.0\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayisi = "Host Sayısı: 65534\n";
                fwrite($cevapTxt, $hostSayisi);

                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);

                $network = "$block1.$block2.0.0\t\t";
                fwrite($cevapTxt, $network);
                $ilk = "$block1.$block2.0.1\t\t";
                fwrite($cevapTxt, $ilk);
                $son = "$block1.$block2.255.254\t\t\t";
                fwrite($cevapTxt, $son);
                $broadcast = "$block1.$block2.255.255\t\n";
                fwrite($cevapTxt, $broadcast);

                fclose($cevapTxt);
            }elseif ($altagSayisi <= 256) {
                $blokSayisi = ((65536/$altagSayisi)/256); // (65536/$altagSayisi) her ağ daki ip sayısı ,((65536/$altagSayisi)/256) blok sayısı
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");
                
                $altagMaske = altagMaskesiBul($altagSayisi);
                $altagMaskesi = "Altag Maskesi: 255.255.$altagMaske.0\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayi = ((65536/$altagSayisi)-2);
                $hostSayisi = "Host Sayısı: $hostSayi\n";
                fwrite($cevapTxt, $hostSayisi);

                $agNumarasi = "Ağ Numarası\t\t";
                fwrite($cevapTxt, $agNumarasi);
                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);
                
                for ($i=0; $i < $altagSayisi; $i++) { 
                    $agNo = "\t$i\t\t";
                    fwrite($cevapTxt, $agNo);

                    $net = $blokSayisi*$i;
                    $network = "$block1.$block2.$net.0\t\t";
                    fwrite($cevapTxt, $network);
                    $ilkIP = $blokSayisi*$i;
                    $ilk = "$block1.$block2.$ilkIP.1\t\t";
                    fwrite($cevapTxt, $ilk);
                    $sonIpadresi = (($blokSayisi*$i)+($blokSayisi-1));
                    $son = "$block1.$block2.$sonIpadresi.254\t\t";
                    fwrite($cevapTxt, $son);
                    $broad = ($blokSayisi*$i)+($blokSayisi-1);
                    $broadcast = "$block1.$block2.$broad.255\t\n";
                    fwrite($cevapTxt, $broadcast);
                }

                fclose($cevapTxt);
            }else {
                $ipSayisi = (65536/$altagSayisi); //her blokdaki ip sayısı
                $blokDonguSayisi = 256/$ipSayisi; //blok sayısı (her blokdaki alt ağ sayısı (0-256))
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");
                
                $altagMaske = altagMaskesiBul($altagSayisi);
                $altagMaskesi = "Altag Maskesi: 255.255.255.$altagMaske\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayi = ($ipSayisi-2);
                $hostSayisi = "Host Sayısı: $hostSayi\n";
                fwrite($cevapTxt, $hostSayisi);

                $agNumarasi = "Ağ Numarası\t\t";
                fwrite($cevapTxt, $agNumarasi);
                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);

                $agSirasi = 0;                   //alt ağ sayısı arttıkça ip sayısı azalır
                for ($i=0; $i < 256; $i++) {    //256*blokDonguSayisi  alt ağ sayısı kadar for çalışır.
                    for ($j=0; $j < $blokDonguSayisi; $j++) {  //65536/512=128 , 256/128=2 her blokdaki alt ağ sayısı
                        $agNo = "\t$agSirasi\t\t";
                        fwrite($cevapTxt, $agNo);

                        $net = $ipSayisi*$j;
                        $network = "$block1.$block2.$i.$net\t\t";
                        fwrite($cevapTxt, $network);
                        $ilkIP = ($ipSayisi*$j)+1;
                        $ilk = "$block1.$block2.$i.$ilkIP\t\t";
                        fwrite($cevapTxt, $ilk);
                        $sonIpadresi = (($ipSayisi*$j)+($ipSayisi-2));
                        $son = "$block1.$block2.$i.$sonIpadresi\t\t";
                        fwrite($cevapTxt, $son);
                        $broad = ($ipSayisi*$j)+($ipSayisi-1);
                        $broadcast = "$block1.$block2.$i.$broad\t\n";
                        fwrite($cevapTxt, $broadcast);

                        $agSirasi++;
                    }
                }
                fclose($cevapTxt);
            }

        }
        //A sınıfı hesaplama
        elseif ($sinif == "A") {
            if($altagSayisi == 1){
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");

                $altagMaskesi = "Altag Maskesi: 255.0.0.0\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayisi = "Host Sayısı: 16777214\n";
                fwrite($cevapTxt, $hostSayisi);

                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);

                $network = "$block1.0.0.0\t\t";
                fwrite($cevapTxt, $network);
                $ilk = "$block1.0.0.1\t\t";
                fwrite($cevapTxt, $ilk);
                $son = "$block1.255.255.254\t\t\t";
                fwrite($cevapTxt, $ilk);
                $broadcast = "$block1.255.255.255\t\n";
                fwrite($cevapTxt, $broadcast);

                fclose($cevapTxt);
            }elseif ($altagSayisi <= 256) {
                $blockArtisSayisi = (((16777216/$altagSayisi)/256)/256); //her ağın blok artış sayısı
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");
                
                $altagMaske = altagMaskesiBul($altagSayisi);
                $altagMaskesi = "Altag Maskesi: 255.$altagMaske.0.0\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayi = (($blockArtisSayisi*256*256)-2);
                $hostSayisi = "Host Sayısı: $hostSayi\n";
                fwrite($cevapTxt, $hostSayisi);

                $agNumarasi = "Ağ Numarası\t\t";
                fwrite($cevapTxt, $agNumarasi);
                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);
                
                for ($i=0; $i < $altagSayisi; $i++) { 
                    $agNo = "\t$i\t\t";
                    fwrite($cevapTxt, $agNo);

                    $net = $blockArtisSayisi*$i;
                    $network = "$block1.$net.0.0\t\t";
                    fwrite($cevapTxt, $network);
                    $ilkIP = $blockArtisSayisi*$i;
                    $ilk = "$block1.$ilkIP.0.1\t\t";
                    fwrite($cevapTxt, $ilk);
                    $sonIpadresi = (($blockArtisSayisi*$i)+($blockArtisSayisi-1));
                    $son = "$block1.$sonIpadresi.255.254\t\t";
                    fwrite($cevapTxt, $son);
                    $broad = ($blockArtisSayisi*$i)+($blockArtisSayisi-1);
                    $broadcast = "$block1.$broad.255.255\t\n";
                    fwrite($cevapTxt, $broadcast);
                }

                fclose($cevapTxt);
            }elseif ($altagSayisi <= 65536) {
                $oktetArtisMiktari = ((16777216/$altagSayisi)/256); //3. oktet artış miktarı
                $blokSayisi = 256/$oktetArtisMiktari; //her blok daki (0-256) alt ağ sayısı
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");
                
                $altagMaske = altagMaskesiBul($altagSayisi);
                $altagMaskesi = "Altag Maskesi: 255.255.$altagMaske.0\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayi = (($oktetArtisMiktari*256)-2);
                $hostSayisi = "Host Sayısı: $hostSayi\n";
                fwrite($cevapTxt, $hostSayisi);

                $agNumarasi = "Ağ Numarası\t\t";
                fwrite($cevapTxt, $agNumarasi);
                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);

                $agSirasi = 0;
                for ($i=0; $i < 256; $i++) {  //256*blokSayisi= alt ağ sayısı
                    for ($j=0; $j < $blokSayisi; $j++) { 
                        $agNo = "\t$agSirasi\t\t";
                        fwrite($cevapTxt, $agNo);

                        $net = $oktetArtisMiktari*$j;
                        $network = "$block1.$i.$net.0\t\t";
                        fwrite($cevapTxt, $network);
                        $ilkIP = ($oktetArtisMiktari*$j);
                        $ilk = "$block1.$i.$ilkIP.1\t\t";
                        fwrite($cevapTxt, $ilk);
                        $sonIpadresi = (($oktetArtisMiktari*$j)+($oktetArtisMiktari-1));
                        $son = "$block1.$i.$sonIpadresi.254\t\t";
                        fwrite($cevapTxt, $son);
                        $broad = ($oktetArtisMiktari*$j)+($oktetArtisMiktari-1);
                        $broadcast = "$block1.$i.$broad.255\t\n";
                        fwrite($cevapTxt, $broadcast);
                        $agSirasi++;
                    }
                }
                fclose($cevapTxt);
            }else {
                $ipSayisi = (16777216/$altagSayisi); //her blokdaki ip sayısı   16777216/131072=128
                $blokSayisi = 256/$ipSayisi; //her blokdaki alt ağ sayısı (0-256)   256/128=2
                $cevapTxt = fopen("cevap.txt", "w") or die("Dosya Oluşturulamadı!");
                
                $altagMaske = altagMaskesiBul($altagSayisi);
                $altagMaskesi = "Altag Maskesi: 255.255.255.$altagMaske\n";
                fwrite($cevapTxt, $altagMaskesi);
                $hostSayi = ($ipSayisi-2);
                $hostSayisi = "Host Sayısı: $hostSayi\n";
                fwrite($cevapTxt, $hostSayisi);

                $agNumarasi = "Ağ Numarası\t\t";
                fwrite($cevapTxt, $agNumarasi);
                $networkAdresi = "Network Adresi\t\t";
                fwrite($cevapTxt, $networkAdresi);
                $ilkIp = "İlk İp\t\t\t";
                fwrite($cevapTxt, $ilkIp);
                $sonIp = "Son İp\t\t\t";
                fwrite($cevapTxt, $sonIp);
                $broadcastAdresi = "Broadcast Adresi\t\n";
                fwrite($cevapTxt, $broadcastAdresi);

                $agSirasi = 0;
                for ($i=0; $i < 256; $i++) { 
                    for ($k=0; $k < 256; $k++) {
                        for ($j=0; $j < $blokSayisi; $j++) { 
                            $agNo = "\t$agSirasi\t\t";
                            fwrite($cevapTxt, $agNo);

                            $net = $ipSayisi*$j;
                            $network = "$block1.$i.$k.$net\t\t";
                            fwrite($cevapTxt, $network);
                            $ilkIP = ($ipSayisi*$j)+1;
                            $ilk = "$block1.$i.$k.$ilkIP\t\t";
                            fwrite($cevapTxt, $ilk);
                            $sonIpadresi = (($ipSayisi*$j)+($ipSayisi-2));
                            $son = "$block1.$i.$k.$sonIpadresi\t\t";
                            fwrite($cevapTxt, $son);
                            $broad = ($ipSayisi*$j)+($ipSayisi-1);
                            $broadcast = "$block1.$i.$k.$broad\t\n";
                            fwrite($cevapTxt, $broadcast);
                            $agSirasi++;
                        }
                    }    
                }
                fclose($cevapTxt);
            }
        }else {
            array_push($hatalar, " 'Geçersiz Sınıf!' ");
        }   
    }else {
        array_push($hatalar, " 'Hatalı İp veya Hatalı Altağ Sayısı !' ");
    }



?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="/css/style.css">
    <title>Altağlara Bölme</title>
</head>
<body>
    
    <div class="container-fluid">
        <!--Header-->
        <div class="row" id="header">
            <div class="col">
                <h1 class="w-100 p-4 text-center bg-dark text-warning">
                    <b>Alt Ağ Hesaplama</b></h1>
            </div>
        </div>

        <!--Main and Menu-->
        <div class="row">
            <div class="col">
                <nav class="navbar navbar-expand-md bg-dark navbar-dark">
                    <a class="navbar-brand d-md-none" href="#">Kategoriler</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                      <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="collapsibleNavbar">
                      <ul class="navbar-nav">
                        <li class="nav-item">
                          <a class="nav-link" href="/html/index.html">Anasayfa</a>
                        </li>
                        <li class="nav-item ">
                            <span class="nav-link d-none d-md-block text-warning"><b>|</b></span>
                        </li>
                        <li class="nav-item">
                          <a id="konuSec1" class="nav-link" href="/html/hostBilgisi.html"> Host Bilgisi</a>
                        </li>
                        <li class="nav-item">
                            <span class="nav-link d-none d-md-block text-warning"><b>|</b></span>
                        </li>
                        <li class="nav-item">
                          <a id="konuSec2" class="nav-link" href="/html/altaglaraBolme.html">Alt Ağlara Bölme</a>
                        </li>  
                        <li class="nav-item">
                            <span class="nav-link d-none d-md-block text-warning"><b>|</b></span>
                        </li> 
                        <li class="nav-item">
                            <a id="konuSec3" class="nav-link" href="/html/degiskenUzunlukluAltaglar.html">Değişken Uzunluklu Alt Ağlara Bölme</a>
                        </li> 
                        <li class="nav-item">
                            <span class="nav-link d-none d-md-block text-warning"><b>|</b></span>
                        </li>  
                        <li class="nav-item">
                            <a class="nav-link" href="/html/iletisim.html">İletişim</a>
                        </li>
                      </ul>
                    </div>  
                  </nav>
            </div> 
        </div>

        <!--hata divi-->
        <div class="row  mt-5">
            <div class="col text-center">
                <p id="hatalar" class="text-danger">
                    <b>
                        <?php 
                            for ($i=0; $i < count($hatalar); $i++) { 
                                echo $hatalar[$i];
                            }
                        ?>
                    </b>
                </p>
            </div>
        </div>

        <?php if ($sinifKontrolu) { ?>
        <div class="row mt-5">
            <div class="col text-center">
                <a href="cevap.txt" class="btn btn-success" download>Sonuçları İndir</a>
            </div>
        </div>
        <?php } ?>

        <!--Footer-->
        <div class="row fixed-bottom">
            <div class="col bg-dark py-4 text-center text-warning">
            <p>©Telif Hakkı 2022 ornekhostadi.com</p>
            </div>
        </div>
    </div>
            

    
 <!-- jQuery library -->
 <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>

 <!-- Popper JS -->
 <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>

 <!-- Latest compiled JavaScript -->
 <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>



