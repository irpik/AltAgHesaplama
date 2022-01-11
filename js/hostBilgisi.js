//host bilgisi
//binary sayıları decimale çeviriyor
function bin_to_dec(bstr) { 
    return parseInt((bstr + '')
    .replace(/[^01]/gi, ''), 2);
}

function hesapla(){
    var ipAdresi = [];
    //input dan ip verilerini alıyor.
    for (let index = 0; index < 5; index++) {
        var inputIsim = "hbInput"+(index+1); //hbInput1
        ipAdresi.push(parseInt(document.getElementById(inputIsim).value));
    }

    //************** Kontroller *************************/

    //hata dizisi
    var hataDizisi = [];

    //boş ip değeri girilmiş ise işlem başlatılmayacak ve 0-255 arası ip değeri kontrolü yapılıyor
    var ipKontrol = true;
    for (let index = 0; index < 5; index++) {
        if (ipAdresi[index] >= 0 && ipAdresi[index] <= 255) {
            ipKontrol = true;
        }
        else if (ipAdresi[index] > 255) {
            hataDizisi.push(" İp değeri 255 den büyük olamaz ");
            ipKontrol = false;
        }
        else if (ipAdresi[index] < 0) {
            hataDizisi.push(" İp değeri 0'dan küçük olamaz ");
            ipKontrol = false;
        }
        else{
            ipKontrol = false;
            hataDizisi.push(" Boş ip alanı mevcut!! ");
        }
    }

    //ilk ip ye göre alt ağ maskesi değeri kontrolü yapıldı. yanlış değer ile işlem yapılması engellendi
    var agOnay = false;
    //c sınıfı kontrol
    if(ipAdresi[0] >= 192 && ipAdresi[0] <= 223 && ipAdresi[4] >= 24 && ipAdresi[4] <= 30){
        agOnay = true;
    }
    //b sınıfı kontrol
    else if(ipAdresi[0] >= 128 && ipAdresi[0] <= 191 && ipAdresi[4] >= 16 && ipAdresi[4] <= 30){
        agOnay = true;
    }
    //a sınıfı kontrol
    else if(ipAdresi[0] >= 1 && ipAdresi[0] <= 126 && ipAdresi[4] >= 8 && ipAdresi[4] <= 30){
        agOnay = true;
    }
    //ag sınıfı kontrol
    else if(ipAdresi[0] >= 224){
        agOnay = false;
        hataDizisi.push(" Hatalı İp Değeri!! A-B-C sınıf aralıklarında bir İp değeri giriniz");
    }
    else{
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
    //************** Kontroller Sonu *************************/

    //*****Hesaplamalar*****
    if(ilkIpOnay && agOnay && ipKontrol){
        //alt ağ maskesini hesaplama
        var altAgMaskesi = [];
            
        var altAgMaskesiSonuc = "";
        for (let i = 0; i< ipAdresi[4]; i++) {
            altAgMaskesiSonuc += "1";
        }
        for (let i = 0; i < 32-ipAdresi[4]; i++) {
            altAgMaskesiSonuc += "0";
        }

        for (let i = 0; i < 8; i++) {
            altAgMaskesi[0] += altAgMaskesiSonuc[i]; //0-7
            altAgMaskesi[1] += altAgMaskesiSonuc[i+8]; //8-15
            altAgMaskesi[2] += altAgMaskesiSonuc[i+16]; //16-23
            altAgMaskesi[3] += altAgMaskesiSonuc[i+24]; //24-31
            
        }
        altAgMaskesi[0] = bin_to_dec(altAgMaskesi[0]);   //binary sayıları decimal yapar (100=4)  
        altAgMaskesi[1] = bin_to_dec(altAgMaskesi[1]);        
        altAgMaskesi[2] = bin_to_dec(altAgMaskesi[2]);
        altAgMaskesi[3] = bin_to_dec(altAgMaskesi[3]);

        var cevapAgMaskesi = altAgMaskesi[0] + "." + altAgMaskesi[1] + "." 
                            + altAgMaskesi[2] + "." + altAgMaskesi[3];
        

        document.getElementById("altAgMaskesi").innerHTML = cevapAgMaskesi;
        //alt ağ maskesi sonu ----------------------
        
        //network adresi bulma
        var networkAdresi = [];
        var cevapNetworkAdresi;
        for (let i = 0; i < 4; i++) {
            networkAdresi[i] = ipAdresi[i] & altAgMaskesi[i];
        }

        cevapNetworkAdresi = networkAdresi[0] + "." + networkAdresi[1] +
                            "." + networkAdresi[2] + "." + networkAdresi[3];

        document.getElementById("networkAdresi").innerHTML = cevapNetworkAdresi;
        //network adresi bulma son --------------

        //ilk ip bulma
        var cevapIlkIp = networkAdresi[0] + "." + networkAdresi[1] + "." 
                        + networkAdresi[2] + "." + (networkAdresi[3]+1);
        document.getElementById("ilkIp").innerHTML = cevapIlkIp;
        //ilk ip bulma son ---------

        //broadcast adresi bulma Ve son ip bulma
        var broadcast = [];
        function broadcastFonksiyon(kalanHostBitSayisi, blockSirasi){ //blockSirasi ip adresimizdeki blok sırası
            var broadcastEkle = "";                                
            for (let i = 0; i < kalanHostBitSayisi; i++) {
                broadcastEkle += "1";
            }
            broadcast.push(ipAdresi[blockSirasi] | bin_to_dec(broadcastEkle));
        }

        var kalanHostBitSayisi = 32 - ipAdresi[4]; //kalan host bit sayısı
        //C sınıfı için
        if (ipAdresi[0] >= 192 && ipAdresi[0] <= 223) { //00000000.00000000.00000000.00111111
            broadcastFonksiyon(kalanHostBitSayisi,3); //3. ip adresindeki blok sırası 0-1-2-3 e kadar
        }
        //B sınıfı için
        else if (ipAdresi[0] >= 128 && ipAdresi[0] <= 191) {
            if (kalanHostBitSayisi > 8) {
                broadcastFonksiyon(8,3); //00000000.00000000.00001111.11111111 örnek son 8 bit gönderilir
                broadcastFonksiyon((kalanHostBitSayisi-8),2);  //kalan bitler gönderilir
            }
            else{
                broadcastFonksiyon(kalanHostBitSayisi,3);
            }
        }
        //A sınıfı için
        else if (ipAdresi[0] >= 1 && ipAdresi[0] <= 126) { //00000000.00000111.11111111.11111111
            if (kalanHostBitSayisi > 16) {
                broadcastFonksiyon(8,3);
                broadcastFonksiyon(8,2);
                broadcastFonksiyon((kalanHostBitSayisi-16),1);
            }
            else if (kalanHostBitSayisi > 8) {
                broadcastFonksiyon(8,3);
                broadcastFonksiyon((kalanHostBitSayisi-8),2);
            }
            else{
                broadcastFonksiyon(kalanHostBitSayisi,3);
            }
        }
        //broadcast ve son ip yazdırma
        var broadcastYaz = "";
        var sonIpEkle = "";
        if (broadcast.length == 1) {
            broadcastYaz = ipAdresi[0] + "." + ipAdresi[1] + "." + ipAdresi[2] + "." + broadcast[0];
            document.getElementById("broadcastAdresi").innerHTML = broadcastYaz;
            sonIpEkle = ipAdresi[0] + "." + ipAdresi[1] + "." + ipAdresi[2] + "." + (broadcast[0]-1);
            document.getElementById("sonIp").innerHTML = sonIpEkle;
        }
        else if (broadcast.length == 2) {
            broadcastYaz = ipAdresi[0] + "." + ipAdresi[1] + "." + broadcast[1] + "." + broadcast[0];
            document.getElementById("broadcastAdresi").innerHTML = broadcastYaz;
            sonIpEkle = ipAdresi[0] + "." + ipAdresi[1] + "." + broadcast[1] + "." + (broadcast[0]-1);
            document.getElementById("sonIp").innerHTML = sonIpEkle;
        }
        else if (broadcast.length == 3) {
            broadcastYaz = ipAdresi[0] + "." + broadcast[2] + "." + broadcast[1] + "." + broadcast[0];
            document.getElementById("broadcastAdresi").innerHTML = broadcastYaz;
            sonIpEkle = ipAdresi[0] + "." + broadcast[2] + "." + broadcast[1] + "." + (broadcast[0]-1);
            document.getElementById("sonIp").innerHTML = sonIpEkle;
        }
        else{
            document.getElementById("broadcastAdresi").innerHTML = "Hatalı Broadcast";
            document.getElementById("sonIp").innerHTML = "Hatalı Son IP";
        }
        //broadcast adresi ve son ip bloğu sonu ------------------

        //toplam host sayısı
        var hostBitSayisi = 32-ipAdresi[4];
        var hostSayisi = Math.pow(2,hostBitSayisi)-2;
        document.getElementById("hostSayisi").innerHTML = hostSayisi;
        //toplam host sayısı son

        //hatasız çalışınca eski hata mesajları gizlenir
        document.getElementById("hataMesajı").style.display = "none";

    }else{
        //hata mesajını aç
        document.getElementById("hataMesajı").style.display = "block";
        //hatalar
        document.getElementById("hataMesajı").innerHTML = hataDizisi;
    }
}