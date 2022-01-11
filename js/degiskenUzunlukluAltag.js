var hostSayilari = []; //girilen host sayıları
var agNumarasiEkle = 2; //ekle buton label numarası
var agOnay = false; //ip ile alt ağ maskesi kontrolü
var hataDizisi = []; //hata mesajlarının eklenmesi için dizi
var kullanilabilecekIpSayilari = []; //hostların ip aralıkları cevap tablosu işlemleri için
var hesaplaTiklamaSayisi = 0; //hesaplama işlemi yapıldıktan sonra tekrar hesaplaya basılır ise fazladan veri eklenmesi engellendi

//host tablosuna verileri ekleme
function hostSayisiEkle(){
    var hataBosHostSayisi = "";

    //host sayıları tabloya ekleniyor
    var hostSayisi = document.getElementById("hostSayisi").value;
    if (hostSayisi != "") {
        hostSayilari.push(hostSayisi);

        var tr = document.createElement("tr");
        
        var agNumarasi = document.createElement("th");
        agNumarasi.appendChild(document.createTextNode(hostSayilari.length));
        tr.appendChild(agNumarasi);

        var host = document.createElement("td");
        host.appendChild(document.createTextNode(hostSayisi));
        tr.appendChild(host);

        for (let j = 2; j <= 24; j++) {
            var ikininKuvveti = Math.pow(2,j); 
            if (ikininKuvveti-1 > hostSayisi) { // ikininKuvveti-1 host sayısı hatasını engellemek için
                var kullanilacakIpSayisi = document.createElement("td");
                kullanilacakIpSayisi.appendChild(document.createTextNode(ikininKuvveti));
                tr.appendChild(kullanilacakIpSayisi);
                kullanilabilecekIpSayilari.push(ikininKuvveti);
                break;
            }
        }
        
        document.getElementById("hostSayilari").appendChild(tr);
        //ağ numarası (ekle buton)
        document.getElementById("agNumarasi").innerHTML = agNumarasiEkle;
        agNumarasiEkle++;
        //hata mesajı
        document.getElementById("hataMesajlari").innerHTML = hataBosHostSayisi;
    }else{
        hataBosHostSayisi = " Boş Host Sayısı Girildi!! ";
        document.getElementById("hataMesajlari").innerHTML = hataBosHostSayisi;
    }
    
}

//host tablosunu temizleme
function hostTablosuSil(){
    for (let i = 0; i < hostSayilari.length; i++) {
        document.getElementById("hostSayilari").deleteRow(0);
    }
    hostSayilari = [];
    
    document.getElementById("agNumarasi").innerHTML = "1";
    agNumarasiEkle = 2;

    hesaplaTiklamaSayisi = 0; //silme işlemi yapılmadan hesapla butonuna basılır ise işlem başlatılmaması için

    cevapTablosuSil();
}
//cevap tablosunu siler
function cevapTablosuSil(){
    var boyut = kullanilabilecekIpSayilari.length;
    kullanilabilecekIpSayilari = []; //cevap tablosunu temizler
    for (let i = 0; i < boyut; i++) {
        document.getElementById("hostCevap").deleteRow(0); //cevap tablosunun satırları siler
    }
}

//altağ maskesi ile host sayısı kontrolü (kullanılabilir ip sayısı)
//Kullanılabilecek İp Sayısı toplamı ile verilen alt ağ maskesi için kullanılabilecek ip sayısı kontrolü
function agOnayFonksiyon(hostSinir, us){
    var hostToplami = 0;
    var hostBuyukMu= false;
    for (let i = 0; i < hostSayilari.length; i++) {
        for (let j = 0; j <= us; j++) {
            var ikininKuvveti = Math.pow(2,j); //host değerini ikinin kuvveti olarak ayarlanıyor
            if (ikininKuvveti >= hostSayilari[i]) {
                hostToplami += ikininKuvveti;
                break;
            }if (hostSayilari[i] > hostSinir) {
                hostBuyukMu = true;
                break;
            }
        }
    }
    if (hostToplami > hostSinir) {
        agOnay = false;
        hataDizisi.push(" Bu ip'ye toplam " + (hostSinir-2) +" host eklenebilir!! ");
    }else if (hostBuyukMu) {
        agOnay = false;
        hataDizisi.push(" Bu ip'ye toplam " + (hostSinir-2) +" host eklenebilir!! ");
    }else {
        agOnay = true;;
    }
}


//++++++++++++++++++++HESAPLAMALAR++++++++++++++++++++++++++++++
function hesaplaBtnDegisken(){
    hataDizisi = [];
    //ip adresi inputdan alınıyor
    var ipAdresi = [];
    for (let i = 1; i < 6; i++) {
        var inputIsim = "ipData"+(i);
        ipAdresi.push(parseInt(document.getElementById(inputIsim).value));
    }

    ///////////////**********************KONTROLLER******************/////////////////////////
    //ip kontrolü yapılıyor hatalı ip girildi ise hesaplama başlatılmıyor
    var ipKontrol = true;
    for (let i = 0; i < 4; i++) {
        if (ipAdresi[0] == 0) {
            ipKontrol = false;
            hataDizisi.push(" İlk ip 0(sıfır) olamaz ");
            break;
        }
        if (ipAdresi[i] >= 0 && ipAdresi[i] <= 255) {
            ipKontrol = true;
        }
        else{
            ipKontrol = false;
            hataDizisi.push(" Boş ip alanı mevcut ");
            break;
        }
    }

    //host sayılarına network ve broadcast adresleri için 2 adet ip ekleniyor
    for (let i = 0; i < hostSayilari.length; i++) {
        hostSayilari[i] = parseInt(hostSayilari[i])+2;
    }

    //ilk ip ye göre alt ağ maskesi değeri kontrolü yapıldı. yanlış değer ile işlem yapılması engellendi
    //ve altağ maskesi ile host sayısı kontrolü
    var hostSinir = Math.pow(2,(32-ipAdresi[4])); //ağ maskesine göre host sayısı bulunuyor.
    var ipSinifi = ""; //bu sınıfa göre hesaplamalar yapılacak
    if(ipAdresi[0] >= 192 && ipAdresi[0] <= 223 && ipAdresi[4] >= 24 && ipAdresi[4] <= 30){
        agOnayFonksiyon(hostSinir, (32-ipAdresi[4])); // hostSinir, us
        ipSinifi = "C";
    }
    else if(ipAdresi[0] >= 128 && ipAdresi[0] <= 191 && ipAdresi[4] >= 16 && ipAdresi[4] <= 30){
        agOnayFonksiyon(hostSinir, (32-ipAdresi[4])); // hostSinir, us
        ipSinifi = "B";
    }
    else if(ipAdresi[0] >= 1 && ipAdresi[0] <= 126 && ipAdresi[4] >= 8 && ipAdresi[4] <= 30){
        agOnayFonksiyon(hostSinir, (32-ipAdresi[4])); // hostSinir, us
        ipSinifi = "A";
    }
    else if(ipAdresi[0] >= 224 && ipAdresi[0] <= 0){
        agOnay = false;
        hataDizisi.push(" Hatalı İp Değeri!! A-B-C sınıf aralıklarında bir İp değeri giriniz");
    }else{
        agOnay = false;
        hataDizisi.push(" Hatalı Ağ Adresi Değeri!! ");
    }
    //ilk ip değeri 127 olamaz kontrol yapılıyor
    var ilkIpOnay = false;
    if (ipAdresi[0] != 127) {
        ilkIpOnay = true;
    }
    else{
        ilkIpOnay = false;
        hataDizisi.push(" Özel ip ile işlem yapılamaz.(127.xxx.xxx.xxx) ");
    }

    //host sayıları girilmiş mi kontrol ediliyor
    if (hostSayilari.length == 0) {
        hataDizisi.push(" Host Sayısı giriniz!! ");
    }

    ////////////////************************KONTROLLER SONU*********************////////////////////
    
    //hesaplamalar (kullanilabilecekIpSayilari-ipAdresi-ipSinifi)
    if (ipKontrol && hostSayilari.length > 0 && agOnay && ilkIpOnay) {
        document.getElementById("hataMesajlari").innerHTML = hataDizisi;//hata alanını temizleme

        hesaplaTiklamaSayisi++; //hesaplama butonuna tıklama sayısını tutar aynı işlemler için birden fazla tıklama yapılır tabloya fazla veri girişini engeller
        var ipToplami = 0;
        var networkTemp = 1; //geçici olarak network adresinin tutar ve bir sonraki network için içindeki veri kullanılır.
        var networkTempA = 1;
        var cevapDizisi = []; //hesaplanan cevaplar eklenir
        var girisKontrolB = true; //a ve b sınıfındaki bazı if veya if else durumlarına girilmiş mi temp değeri değişikliği için
                                 // eğer girilmiş ise false yapılarak temp değeri değiştirilmedi
        var girisKontrolA = true;
        //****C sınıfı hesaplamalar****
        if (ipSinifi == "C" && hesaplaTiklamaSayisi == 1) {
            for (let i = 0; i < kullanilabilecekIpSayilari.length; i++) {
                var altagSonuc = altagMaskesiHesapla(kullanilabilecekIpSayilari[i]); //toplam ip sayısı
                var altagCevap = "255.255.255."+altagSonuc;
            
                ipToplami += kullanilabilecekIpSayilari[i];
                var networkSonuc = networkAdresiHesapla(altagSonuc, ipToplami-1);
                var networkCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + ipAdresi[2] + "." + networkSonuc;

                var broadcastCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + ipAdresi[2] + "." + (ipToplami-1);

                var ilkIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + ipAdresi[2] + "." + (networkSonuc+1);
                
                var sonIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + ipAdresi[2] + "." + (ipToplami-2);
                
                cevapDizisi = [];
                cevapDizisi.push(i+1);
                cevapDizisi.push(networkCevap);
                cevapDizisi.push(ilkIpCevap);
                cevapDizisi.push(sonIpCevap);
                cevapDizisi.push(broadcastCevap);
                cevapDizisi.push(altagCevap);

                cevapTablosu(cevapDizisi);
            }
        }
        //****B sınıfı hesaplamalar****
        else if (ipSinifi == "B" && hesaplaTiklamaSayisi == 1) {
            for (let i = 0; i < kullanilabilecekIpSayilari.length; i++) {
                //altağ maskesi
                var altagSonuc = altagMaskesiHesapla(kullanilabilecekIpSayilari[i]);
                var altagCevap = "";
                if (kullanilabilecekIpSayilari[i] <= 256) {
                    altagCevap = "255.255.255."+altagSonuc;
                }else{
                    altagCevap = "255.255."+ altagSonuc +".0";
                }

                var networkSonuc = "";
                var networkCevap = "";
                var broadcastCevap = "";
                var ilkIpCevap = "";
                var sonIpCevap = "";
                if (kullanilabilecekIpSayilari[i] > 256) {
                    if (networkTemp > 1) {
                        networkTemp += kullanilabilecekIpSayilari[i]/256;
                    }

                    networkSonuc = networkAdresiHesapla(altagSonuc, networkTemp-1);
                    networkCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkSonuc + ".0";
                    
                    ilkIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkSonuc + ".1";

                    if (networkTemp == 1) {
                        networkTemp = kullanilabilecekIpSayilari[i]/256;
                    }
                    broadcastCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + (networkTemp-1) + ".255";
                    sonIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + (networkTemp-1) + ".254";

                    girisKontrolB = false; //temp değeri için
                }else if (kullanilabilecekIpSayilari[i] == 256) {
                    if (girisKontrolB) {
                        networkTemp = 0;
                        girisKontrolB = false;
                    }

                    networkCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + ".0";
                    ilkIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + ".1";
                    broadcastCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + ".255";
                    sonIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + ".254";

                    networkTemp++;
                }else{
                    if (girisKontrolB) {
                        networkTemp = 0;
                        girisKontrolB = false;
                    }

                    ipToplami += kullanilabilecekIpSayilari[i];
                    networkSonuc = networkAdresiHesapla(altagSonuc, ipToplami-1);
                    networkCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + "." + networkSonuc;
                    
                    ilkIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + "." + (networkSonuc+1);
                    broadcastCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + "." + (ipToplami-1);
                    sonIpCevap = ipAdresi[0] + "." + ipAdresi[1] + "." + networkTemp + "." + (ipToplami-2);
                
                    if (ipToplami > 255) {
                        networkTemp++;
                        ipToplami -= 256; 
                    }
                }

                cevapDizisi = [];
                cevapDizisi.push(i+1);
                cevapDizisi.push(networkCevap);
                cevapDizisi.push(ilkIpCevap);
                cevapDizisi.push(sonIpCevap);
                cevapDizisi.push(broadcastCevap);
                cevapDizisi.push(altagCevap);

                cevapTablosu(cevapDizisi);

            }
        }
        //****A sınıfı hesaplamalar****
        else if (ipSinifi == "A" && hesaplaTiklamaSayisi == 1) {
            for (let i = 0; i < kullanilabilecekIpSayilari.length; i++) {
                //altağ maskesi
                var altagSonuc = altagMaskesiHesapla(kullanilabilecekIpSayilari[i]);
                var altagCevap = "";
                if (kullanilabilecekIpSayilari[i] <= 256) {
                    altagCevap = "255.255.255."+altagSonuc;
                }else if(kullanilabilecekIpSayilari[i] <= 65536){
                    altagCevap = "255.255."+ altagSonuc +".0";
                }else{
                    altagCevap = "255."+ altagSonuc +".0.0";
                }

                var networkSonuc = "";
                var networkCevap = "";
                var broadcastCevap = "";
                var ilkIpCevap = "";
                var sonIpCevap = "";
                if (kullanilabilecekIpSayilari[i] > 65536) {
                    if (networkTempA > 1) {
                        networkTempA += (kullanilabilecekIpSayilari[i]/256)/256;
                    }

                    networkSonuc = networkAdresiHesapla(altagSonuc, networkTempA-1);
                    networkCevap = ipAdresi[0] + "." + networkSonuc + ".0.0";
                    
                    ilkIpCevap = ipAdresi[0] + "." + networkSonuc + ".0.1";

                    if (networkTempA == 1) {
                        networkTempA = (kullanilabilecekIpSayilari[i]/256)/256;
                    }
                    broadcastCevap = ipAdresi[0] + "." + (networkTempA-1) + ".255.255";
                    sonIpCevap = ipAdresi[0] + "." + (networkTempA-1) + ".255.254";

                    girisKontrolA = false; //temp değeri için
                }else if(kullanilabilecekIpSayilari[i] == 65536){
                    if (girisKontrolA) {
                        networkTempA = 0;
                        girisKontrolA = false;
                    }
                    networkCevap = ipAdresi[0] + "." + networkTempA + ".0.0";
                    ilkIpCevap = ipAdresi[0] + "." + networkTempA + ".0.1";
                    broadcastCevap = ipAdresi[0] + "." + networkTempA + ".255.255";
                    sonIpCevap = ipAdresi[0] + "." + networkTempA + ".255.254";

                    networkTempA++;
                }else if (kullanilabilecekIpSayilari[i] > 256) {
                    if (girisKontrolA) {
                        networkTempA = 0;
                        girisKontrolA = false;
                    }

                    if (networkTemp > 1) {
                        networkTemp += kullanilabilecekIpSayilari[i]/256;
                    }

                    networkSonuc = networkAdresiHesapla(altagSonuc, networkTemp-1);
                    networkCevap = ipAdresi[0] + "." + networkTempA + "." + networkSonuc + ".0";
                    
                    ilkIpCevap = ipAdresi[0] + "." + networkTempA + "." + networkSonuc + ".1";

                    if (networkTemp == 1) {
                        networkTemp = kullanilabilecekIpSayilari[i]/256;
                    }
                    broadcastCevap = ipAdresi[0] + "." + networkTempA + "." + (networkTemp-1) + ".255";
                    sonIpCevap = ipAdresi[0] + "." + networkTempA + "." + (networkTemp-1) + ".254";

                    girisKontrolB = false; //temp değeri için
                }else if (kullanilabilecekIpSayilari[i] == 256) {
                    if (girisKontrolA) {
                        networkTempA = 0;
                        girisKontrolA = false;
                    }

                    if (girisKontrolB) {
                        networkTemp = 0;
                        girisKontrolB = false;
                    }

                    networkCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + ".0";
                    ilkIpCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + ".1";
                    broadcastCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + ".255";
                    sonIpCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + ".254";

                    networkTemp++;
                }else{
                    if (girisKontrolA) {
                        networkTempA = 0;
                        girisKontrolA = false;
                    }

                    if (girisKontrolB) {
                        networkTemp = 0;
                        girisKontrolB = false;
                    }

                    ipToplami += kullanilabilecekIpSayilari[i];
                    networkSonuc = networkAdresiHesapla(altagSonuc, ipToplami-1);
                    networkCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + "." + networkSonuc;
                    
                    ilkIpCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + "." + (networkSonuc+1);
                    broadcastCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + "." + (ipToplami-1);
                    sonIpCevap = ipAdresi[0] + "." + networkTempA + "." + networkTemp + "." + (ipToplami-2);
                    
                    if (ipToplami > 255) {
                        networkTemp++;
                        ipToplami -= 256; 
                    }
                }

                cevapDizisi = [];
                cevapDizisi.push(i+1);
                cevapDizisi.push(networkCevap);
                cevapDizisi.push(ilkIpCevap);
                cevapDizisi.push(sonIpCevap);
                cevapDizisi.push(broadcastCevap);
                cevapDizisi.push(altagCevap);

                cevapTablosu(cevapDizisi);
            }



        }else{
            hataDizisi.push("Sınıf hatası");
        }
        


    }else { //kontrollerden geçmez ise hata mesajı çalışacaktır
        document.getElementById("hataMesajlari").innerHTML = hataDizisi;//hataları yazdırma
    }   
}

//cevap tablosuna ekle
function cevapTablosu(cevaplar){
    var tr = document.createElement("tr");
    for (let j = 0; j < 6; j++) {
        var td = document.createElement("td");
        td.appendChild(document.createTextNode(cevaplar[j]));
        tr.appendChild(td);
        document.getElementById("hostCevap").appendChild(tr);
    }
}

//network adresi hesaplama
function networkAdresiHesapla(altagSonuc, geciciNetworkAdresi){
    return altagSonuc & geciciNetworkAdresi;
}

//altağ maskesi hesaplama
function altagMaskesiHesapla(kullanilabilecekIpSayisi){//128
    var basamakSayisi = 0; //host bit sayısı
    do {
        kullanilabilecekIpSayisi /= 2;
        basamakSayisi++;
    } while (kullanilabilecekIpSayisi != 1);

    //a sınıfı için kontrol
    if (basamakSayisi > 16) {
        basamakSayisi = (basamakSayisi-16);
    }
    //b sınıfı için kontrol
    else if (basamakSayisi > 8) {
        basamakSayisi = (basamakSayisi-8);
    }

    var altagMaskesi = 0;
    for (let i = 7; i >= basamakSayisi; i--) {
        altagMaskesi += Math.pow(2,i);
    }
    return altagMaskesi;
}
