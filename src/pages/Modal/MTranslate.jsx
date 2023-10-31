import React, { useEffect } from "react";
import "../../assets/css/translator.css";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import moment from "moment";
import { newQID } from "../../common";


function MTranslate() {
    const question = useSelector((state) => state.question);
    const auth = useSelector((state) => state.auth);
    
  useEffect(()=>{
    document.body.classList.remove('bg-salmon');
  },[])
    return (
        <>

            <section className="model-translate-Popup">
                <div
                    className="modal fade"
                    id="mtranslate"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />

                            <div className="mtranslate-popup-top">
                              <div className="mtranslate-popup-top-left">
                                 <img src={logo} alt="CMFAS Academy Logo" height="40" width="160" />
                              </div>
                              <div className="mtranslate-popup-top-right">
                              <select class="goog-te-combo form-select" aria-label="Language Translate Widget">
                                    <option value="">Select Language</option>
                                    <option value="af">Afrikaans</option>
                                    <option value="sq">Albanian</option>
                                    <option value="am">Amharic</option>
                                    <option value="ar">Arabic</option>
                                    <option value="hy">Armenian</option>
                                    <option value="as">Assamese</option>
                                    <option value="ay">Aymara</option>
                                    <option value="az">Azerbaijani</option>
                                    <option value="bm">Bambara</option>
                                    <option value="eu">Basque</option>
                                    <option value="be">Belarusian</option>
                                    <option value="bn">Bengali</option>
                                    <option value="bho">Bhojpuri</option>
                                    <option value="bs">Bosnian</option>
                                    <option value="bg">Bulgarian</option>
                                    <option value="ca">Catalan</option>
                                    <option value="ceb">Cebuano</option>
                                    <option value="ny">Chichewa</option>
                                    <option value="zh-CN">Chinese (Simplified)</option>
                                    <option value="zh-TW">Chinese (Traditional)</option>
                                    <option value="co">Corsican</option>
                                    <option value="hr">Croatian</option>
                                    <option value="cs">Czech</option>
                                    <option value="da">Danish</option>
                                    <option value="dv">Dhivehi</option>
                                    <option value="doi">Dogri</option>
                                    <option value="nl">Dutch</option>
                                    <option value="eo">Esperanto</option>
                                    <option value="et">Estonian</option>
                                    <option value="ee">Ewe</option>
                                    <option value="tl">Filipino</option>
                                    <option value="fi">Finnish</option>
                                    <option value="fr">French</option>
                                    <option value="fy">Frisian</option>
                                    <option value="gl">Galician</option>
                                    <option value="ka">Georgian</option>
                                    <option value="de">German</option>
                                    <option value="el">Greek</option>
                                    <option value="gn">Guarani</option>
                                    <option value="gu">Gujarati</option>
                                    <option value="ht">Haitian Creole</option>
                                    <option value="ha">Hausa</option>
                                    <option value="haw">Hawaiian</option>
                                    <option value="iw">Hebrew</option>
                                    <option value="hi">Hindi</option>
                                    <option value="hmn">Hmong</option>
                                    <option value="hu">Hungarian</option>
                                    <option value="is">Icelandic</option>
                                    <option value="ig">Igbo</option>
                                    <option value="ilo">Ilocano</option>
                                    <option value="id">Indonesian</option>
                                    <option value="ga">Irish Gaelic</option>
                                    <option value="it">Italian</option>
                                    <option value="ja">Japanese</option>
                                    <option value="jw">Javanese</option>
                                    <option value="kn">Kannada</option>
                                    <option value="kk">Kazakh</option>
                                    <option value="km">Khmer</option>
                                    <option value="rw">Kinyarwanda</option>
                                    <option value="gom">Konkani</option>
                                    <option value="ko">Korean</option>
                                    <option value="kri">Krio</option>
                                    <option value="ku">Kurdish (Kurmanji)</option>
                                    <option value="ckb">Kurdish (Sorani)</option>
                                    <option value="ky">Kyrgyz</option>
                                    <option value="lo">Lao</option>
                                    <option value="la">Latin</option>
                                    <option value="lv">Latvian</option>
                                    <option value="ln">Lingala</option>
                                    <option value="lt">Lithuanian</option>
                                    <option value="lg">Luganda</option>
                                    <option value="lb">Luxembourgish</option>
                                    <option value="mk">Macedonian</option>
                                    <option value="mai">Maithili</option>
                                    <option value="mg">Malagasy</option>
                                    <option value="ms">Malay</option>
                                    <option value="ml">Malayalam</option>
                                    <option value="mt">Maltese</option>
                                    <option value="mi">Maori</option>
                                    <option value="mr">Marathi</option>
                                    <option value="mni-Mtei">Meiteilon (Manipuri)</option>
                                    <option value="lus">Mizo</option>
                                    <option value="mn">Mongolian</option>
                                    <option value="my">Myanmar (Burmese)</option>
                                    <option value="ne">Nepali</option>
                                    <option value="no">Norwegian</option>
                                    <option value="or">Odia (Oriya)</option>
                                    <option value="om">Oromo</option>
                                    <option value="ps">Pashto</option>
                                    <option value="fa">Persian</option>
                                    <option value="pl">Polish</option>
                                    <option value="pt">Portuguese</option>
                                    <option value="pa">Punjabi</option>
                                    <option value="qu">Quechua</option>
                                    <option value="ro">Romanian</option>
                                    <option value="ru">Russian</option>
                                    <option value="sm">Samoan</option>
                                    <option value="sa">Sanskrit</option>
                                    <option value="gd">Scots Gaelic</option>
                                    <option value="nso">Sepedi</option>
                                    <option value="sr">Serbian</option>
                                    <option value="st">Sesotho</option>
                                    <option value="sn">Shona</option>
                                    <option value="sd">Sindhi</option>
                                    <option value="si">Sinhala</option>
                                    <option value="sk">Slovak</option>
                                    <option value="sl">Slovenian</option>
                                    <option value="so">Somali</option>
                                    <option value="es">Spanish</option>
                                    <option value="su">Sundanese</option>
                                    <option value="sw">Swahili</option>
                                    <option value="sv">Swedish</option>
                                    <option value="tg">Tajik</option>
                                    <option value="ta">Tamil</option>
                                    <option value="tt">Tatar</option>
                                    <option value="te">Telugu</option>
                                    <option value="th">Thai</option>
                                    <option value="ti">Tigrinya</option>
                                    <option value="ts">Tsonga</option>
                                    <option value="tr">Turkish</option>
                                    <option value="tk">Turkmen</option>
                                    <option value="ak">Twi</option>
                                    <option value="uk">Ukrainian</option>
                                    <option value="ur">Urdu</option>
                                    <option value="ug">Uyghur</option>
                                    <option value="uz">Uzbek</option>
                                    <option value="vi">Vietnamese</option>
                                    <option value="cy">Welsh</option>
                                    <option value="xh">Xhosa</option>
                                    <option value="yi">Yiddish</option>
                                    <option value="yo">Yoruba</option>
                                    <option value="zu">Zulu</option>
                                    </select>
                                
                              </div>
                            </div>
                              
      <p>
        <br />
        <br />
        <div id="background">
          <p id="bg-text">{newQID(auth.user_id,question.questionlist.id)}</p>
        </div>
        <div id="content">
          ({question.subject_name}) | QID: {newQID(auth.user_id,question.questionlist.id)} |{" "}
          {moment().format("YYYY-MM-DD")}
          <br />
          <br />
          Question: {question.questionlist.question}
          <br />
          <br />
          <p
            style={{
              color: question.questionlist.ans.includes("A")
                ? "green"
                : "black",
            }}
          >
            A) {question.questionlist.choice1}
          </p>
          <p
            style={{
              color: question.questionlist.ans.includes("B")
                ? "green"
                : "black",
            }}
          >
            B) {question.questionlist.choice2}
          </p>
          <p
            style={{
              color: question.questionlist.ans.includes("C")
                ? "green"
                : "black",
            }}
          >
            C) {question.questionlist.choice3}
          </p>
          <p
            style={{
              color: question.questionlist.ans.includes("D")
                ? "green"
                : "black",
            }}
          >
            D) {question.questionlist.choice3}
          </p>{" "}
          Answer:
          {question.questionlist.ans}
          <br />
          <br /> Explanation:
          <br />
          <br />
          {question.questionlist.explanation}
          <br />
          <br />
          <br /> Tip: If you are weak in English, you'll need more practice
          reading English questions. You should use the translation to validate
          your original understanding of the question, as well as to better
          understand the explanation for this question. Furthermore, the quality
          of the translation may vary, so it is not recommended to over-rely on
          translation.
          <br />
          <br />
          <p>
            © All rights reserved to CMFAS Academy. We do <strong>NOT</strong>{" "}
            allow the information here to be copied, stored, downloaded, saved,
            transferred, archived, photographed in any manner. We take a strong
            stance in protecting our intellectual property.
          </p>
        </div>
      </p>
                        </div>
                    </div>

                   
                </div>
            </section> 

            

            {/* <section className="model-Search-Popup">
                <Modal
                    {...props}
                    onHide={props.onHide}
                    animation={false}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    centered
                    aria-labelledby="staticBackdropLabel"
                >
                    <Modal.Header className="btn-close" aria-label="Close" closeButton>
                    </Modal.Header>
                    <Modal.Body>
                      
                        <Iframe
                            url={question.speedRefFileLink}
                            width="100%"
                            height="400px"
                            id=""
                            className=""
                            display="block"
                            position="relative"
                             />

                    </Modal.Body>

                </Modal>
            </section> */}
        </>
    )
}

export default MTranslate