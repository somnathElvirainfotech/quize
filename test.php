<?php 
session_start();
$simple_string = time()."_".$_SESSION['login']."_".$_SESSION['sess_id'];
// echo 'Simple String: '.$simple_string;
$encryption = base64_encode($simple_string);
// echo '<br><br>Encryption: '.$encryption;

?>


<!-- ======= test with cryptjs ============ -->


<br><br><a id="target_a" href="#" alt="Practice Questions">Practice Questions </a>

<script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js" integrity="sha512-a+SUDuwNzXDvz4XrIcXHuCf089/iJAoN4lmrXJg18XnduKK6YlDHNRalv4yd1N40OKI80tFidF+rqTFKGPoWFQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

<script>
    var simple_string="<?php echo $simple_string; ?>";
  

    var data=simple_string;

    var encrypted = CryptoJS.AES.encrypt(data, "somnath999");
    var final_value=btoa(encrypted)
    // console.log(final_value);

    

    document.querySelector("#target_a").setAttribute('href', `https://www.cmfas.com.sg/practice/enlogin/${final_value}`);

    
</script>

