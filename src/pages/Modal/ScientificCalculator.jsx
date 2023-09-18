import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import Iframe from 'react-iframe';
import { useRef } from 'react';

function ScientificCalculator(props) {
    const question = useSelector(state => state.question);
    const modalCloseRef = useRef(null);


    // Define state variables
    const [displayValue, setDisplayValue] = useState('0');

    // Helper functions
    const addChar = (character) => {
        if (displayValue === '0') {
            setDisplayValue(character);
        } else {
            setDisplayValue(displayValue + character);
        }
    };

    const cos = () => {
        setDisplayValue(Math.cos(displayValue));
    };

    const sin = () => {
        setDisplayValue(Math.sin(displayValue));
    };

    const tan = () => {
        setDisplayValue(Math.tan(displayValue));
    };

    const sqrt = () => {
        setDisplayValue(Math.sqrt(displayValue));
    };

    const ln = () => {
        setDisplayValue(Math.log(displayValue));
    };

    const exp = () => {
        setDisplayValue(Math.exp(displayValue));
    };

    const deleteChar = () => {
        setDisplayValue(displayValue.substring(0, displayValue.length - 1));
    };

    const percent = () => {
        setDisplayValue(displayValue + '%');
    };

    const changeSign = () => {
        if (displayValue.substring(0, 1) === '-') {
            setDisplayValue(displayValue.substring(1, displayValue.length));
        } else {
            setDisplayValue('-' + displayValue);
        }
    };

    const compute = () => {
        try {
            

           if((displayValue.match(new RegExp("%", "g")) || []).length > 1){
                alert('Invalid input!');
                setDisplayValue('0');

            }
            else if(displayValue.includes('%') && (displayValue.match(new RegExp("%", "g")) || []).length === 1){
                const value=Number(displayValue.split('%')[0]);
                const percentageValue=Number(displayValue.split('%').pop());
                // alert(`${value} ==== ${percentageValue}`)
                // alert((displayValue.match(new RegExp("%", "g")) || []).length)

                const current_value=(percentageValue/100)*value;
                setDisplayValue(current_value.toString());

            }
            else{
                setDisplayValue(eval(displayValue).toString());
            }

        } catch (error) {
            alert('Invalid input!');
            setDisplayValue('0');
        }
    };

    const square = () => {
        setDisplayValue(Math.pow(eval(displayValue), 2).toString());
    };

    const checkNum = (str) => {
        for (let i = 0; i < str.length; i++) {
            const ch = str.charAt(i);
            if (
                (ch < '0' || ch > '9') &&
                ch !== '/' &&
                ch !== '*' &&
                ch !== '+' &&
                ch !== '-' &&
                ch !== '.' &&
                ch !== '(' &&
                ch !== ')' &&
                ch !== '%'
            ) {
                alert('Invalid entry!');
                return false;
            }
        }
        return true;
    };


    return (
        <>

            <section className="model-Search-Popup calculator-popup">
                <div
                    className="modal fade"
                    id="scientificCalculatorPopup"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex={-1}
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                onClick={()=>setDisplayValue('0')}
                            />


                            <form name="sci-calc">
                                <table class="calculator" cellspacing="0" cellpadding="1">
                                    <tr>
                                        <td colspan="5"><input id="display" name="display" value={displayValue} size="28" maxlength="25" /></td>
                                    </tr>
                                    <tr>
                                        <td><input type="button" class="btnTop" name="btnTop" value="C" onClick={() => setDisplayValue('0')} /></td>
                                        <td><input type="button" class="btnTop" name="btnTop" value="<--" onClick={deleteChar} /></td>
                                        <td><input type="button" class="btnTop" name="btnTop" value="=" onClick={()=>(checkNum(displayValue) && compute())} /></td>
                                        <td><input type="button" class="btnOpps" name="btnOpps" value="&#960;" onClick={()=>addChar('3.14159265359')} /></td>
                                        <td><input type="button" class="btnMath" name="btnMath" value="%" onClick={()=>percent()} /></td>
                                    </tr>
                                    <tr>
                                        <td><input type="button" class="btnNum" name="btnNum" value="7" onClick={()=>addChar('7')} /></td>
                                        <td><input type="button" class="btnNum" name="btnNum" value="8" onClick={()=>addChar('8')} /></td>
                                        <td><input type="button" class="btnNum" name="btnNum" value="9" onClick={()=>addChar('9')} /></td>
                                        <td><input type="button" class="btnOpps" name="btnOpps" value="x&#94;" onClick={()=>(checkNum(displayValue) && exp())} /></td>
                                        <td><input type="button" class="btnMath" name="btnMath" value="/" onClick={()=>addChar('/')} /></td>
                                        <tr>
                                            <td><input type="button" class="btnNum" name="btnNum" value="4" onClick={()=>addChar('4')} /></td>
                                            <td><input type="button" class="btnNum" name="btnNum" value="5" onClick={()=>addChar('5')} /></td>
                                            <td><input type="button" class="btnNum" name="btnNum" value="6" onClick={()=>addChar('6')} /></td>
                                            <td><input type="button" class="btnOpps" name="btnOpps" value="ln" onClick={()=>(checkNum(displayValue) && ln())} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="*" onClick={()=>addChar('*')} /></td>
                                        </tr>
                                        <tr>
                                            <td><input type="button" class="btnNum" name="btnNum" value="1" onClick={()=>addChar('1')} /></td>
                                            <td><input type="button" class="btnNum" name="btnNum" value="2" onClick={()=>addChar('2')} /></td>
                                            <td><input type="button" class="btnNum" name="btnNum" value="3" onClick={()=>addChar('3')} /></td>
                                            <td><input type="button" class="btnOpps" name="btnOpps" value="&radic;" onClick={()=>(checkNum(displayValue) && sqrt())} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="-" onClick={()=>addChar('-')} /></td>
                                        </tr>
                                        <tr>
                                            <td><input type="button" class="btnMath" name="btnMath" value="&#177;" onClick={()=>changeSign} /></td>
                                            <td><input type="button" class="btnNum" name="btnNum" value="0" onClick={()=>addChar('0')} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="&#46;" onClick={()=>addChar('&#46;')} /></td>
                                            <td><input type="button" class="btnOpps" name="btnOpps" value="x&#50;" onClick={()=>(checkNum(displayValue) && square())} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="+" onClick={()=>addChar('+')} /></td>
                                        </tr>
                                        <tr>
                                            <td><input type="button" class="btnMath" name="btnMath" value="(" onClick={()=>addChar('(')} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value=")" onClick={()=>addChar(')')} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="cos" onClick={()=>(checkNum(displayValue) && cos())} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="sin" onClick={()=>(checkNum(displayValue) && sin())} /></td>
                                            <td><input type="button" class="btnMath" name="btnMath" value="tan" onClick={()=>(checkNum(displayValue) && tan())} /></td>
                                        </tr>
                                    </tr>
                                </table>
                            </form>

                            <h5 className='speed-ref'>Scientific Calculator</h5>
                        </div>
                    </div>


                </div>
            </section>




        </>
    )
}

export default ScientificCalculator