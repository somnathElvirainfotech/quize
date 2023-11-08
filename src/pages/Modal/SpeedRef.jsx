import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import parse from 'html-react-parser';
import Iframe from 'react-iframe';
import { useRef } from 'react';

function SpeedRef(props) {
    const question = useSelector(state => state.question);
    const modalCloseRef=useRef(null);

 

    return (
        <>

            <section className="model-Search-Popup">
                <div
                    className="modal fade"
                    id="searchpopup"
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
                                onClick={()=>props.setSpeedRefhandleShow(false)}
                            />
                        <Iframe
                            url={props.speedRefhandleShow ?question.speedRefFileLink:""}
                            width="100%"
                            height="400px"
                            id=""
                            className="my-ovrflow"
                            display="block"
                            position="relative"
                             /> 
                              <h5 className='speed-ref'>Speed Reference</h5>
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

export default SpeedRef