<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
chdir('/var/www/vhosts/cmfas.com.sg/httpdocs');
include_once 'common/mysql.php';
include_once 'phpmailer/emailfunctions.php';
//print_r($con);
$status = false;
$response = [];

switch ($_REQUEST['params']) {
	case 'checklogin':
		// HTTP PUT method request will be used to create a new user
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);

			// Print the POST array

			if (!empty($post_data)) {
				// Decode the json string from the request to Array
				// $request_body = json_decode($_POST, true);
				$txtLogin = mysqli_real_escape_string($con, (string) $post_data['email']);
				$txtPassword = mysqli_real_escape_string($con, (string) $post_data['password']);

				$hash = md5((string) $txtPassword);
				$query = "select * FROM tmember WHERE email='" . $txtLogin . "' AND left(hash,32)='$hash'";
				//echo $query;exit;
				$result = mysqli_query($con, $query);
				$data_array = array();
				if ($result->num_rows > 0) {
					//$data = $result -> fetch_array(MYSQLI_ASSOC);
					//print_r($data);
					while ($row = $result->fetch_assoc()) {
						$data_array[] = $row;
					}
					$status = true;
					$response = array("status" => true, "data" => $data_array);
				} else {
					$status = true;
					$response = array("status" => false, "error" => "Invalid Username or Password");
				}
			} else {

				$status = true;
				$response = array("status" => false, "error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("status" => false, "error" => "Something went wrong","data"=>$test1);
		}


		break;
		case 'checkencryptlogin':
			// HTTP PUT method request will be used to create a new user
			if ($_SERVER['REQUEST_METHOD'] == 'POST') {
				$data = file_get_contents('php://input');
				$post_data = json_decode($data, true);
	
				// Print the POST array
	
				if (!empty($post_data)) {
					// Decode the json string from the request to Array
					// $request_body = json_decode($_POST, true);
					
					$user_id=$post_data['user_id'];
					$session_id=$post_data['session_id'];
					$query = "select * FROM tmember WHERE id='" . $user_id . "' AND loginsession='".$session_id."'";
					//echo $query;exit;
					$result = mysqli_query($con, $query);
					$data_array = array();
					if ($result->num_rows > 0) {
						//$data = $result -> fetch_array(MYSQLI_ASSOC);
						//print_r($data);
						while ($row = $result->fetch_assoc()) {
							$data_array[] = $row;
						}
						$status = true;
						$response = array("status" => true, "data" => $data_array);
					} else {
						$status = true;
						$response = array("status" => false, "error" => "Invalid Username or Password");
					}
				} else {
	
					$status = true;
					$response = array("status" => false, "error" => "Invalid parameters");
				}
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Something went wrong");
			}
	
	
			break;
		
	case 'TestEngineFilterList':
		// HTTP POST method will be used the update the data for the requested user id
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);

			if (!empty($post_data)) {
				//$mem_id = 12345;
				$mem_id = $post_data['mem_id'];
				$engine_type = $post_data['engine_type'];

				if ($engine_type == "filter") {

					$subresults = "SELECT TO_DAYS(eDate) - TO_DAYS(CURDATE()) as xx,examName,examId,memId,sDate,eDate FROM subscribetbl WHERE memId='" . $mem_id . "' and eDate >= CURDATE() order by examId ASC";
					$subresults_1 = mysqli_query($con, $subresults);
					$active = '';
					$free = '';
					$ii = 0;

					$main_dropdown_data = [];
					$main_dropdown_data[0][0]['option'] = "Orientation";
					$main_dropdown_data[0][0]['option_value'] = "[FAQ]";
					$main_dropdown_data[0][1]['option'] = "Bookmarked Questions";
					$main_dropdown_data[0][1]['option_value'] = "[BQ]";
					$ii++;

					while ($row = mysqli_fetch_array($subresults_1)) {

						$active_sids[$ii] = "'" . $row['examId'] . "'";
						$sid = $row['examId'];

						$exid_string_3 = substr((string) $sid, 0, 3);
						$exid_string = substr((string) $sid, 0, 3) . "C";



						$pos = strpos((string) $sid, "C");
						$pos_basic = strpos((string) $sid, "B");
						$pos_success = strpos((string) $sid, "S");
						$pos_elite = strpos((string) $sid, "L");
						$pos_vip = strpos((string) $sid, "V");
						$pos_gold = strpos((string) $sid, "G");
						$pos_diamond = strpos((string) $sid, "D");
						$dropdown_array = [];
						if ($row['xx'] >= 0 && ($pos !== false || $pos_basic !== false || $pos_success !== false || $pos_elite !== false || $pos_vip !== false || $pos_gold !== false || $pos_diamond !== false)) {
							$mysqlfull = "select * from subjects2 where excl != 1 and id like '%" . $exid_string_3 . "%' and qty > 0 order by id";
							$mysqlfull_1 = mysqli_query($con, $mysqlfull);
							$t = 0;
							//$row_full = mysqli_fetch_array($mysqlfull_1);
							while ($row_full = mysqli_fetch_array($mysqlfull_1)) {
								$subjectname = $row_full['shortname'];
								$main_dropdown_data[$ii][$t]['option'] = $subjectname . ' [' . $row_full['qty'] . ']';
								$main_dropdown_data[$ii][$t]['option_value'] = $row_full['tag'];
								$t++;
								//$active .= '<option value="' . $row_full['tag'] . '" style="color:#000;">' . $subjectname . ' ['.$row_full['qty'].']</option>';
							}
							//print_r($dropdown_array);exit;
						} else if ($row['xx'] > 0 && ($pos === false && $pos_basic === false && $pos_success === false && $pos_elite === false && $pos_vip === false && $pos_gold === false || $pos_diamond === false)) {
							$mysql = "select * from subjects2 where id >= 0 and excl != 1 and id ='" . $sid . "' and qty > 0 order by id";
							$msql_1 = mysqli_query($con, $mysql);
							$row1 = mysqli_fetch_array($msql_1);
							//print_r($row1);exit;
							// $subjectname = $row1['shortname'];
							$main_dropdown_data[$ii]['option'] = $subjectname . ' [' . $row1['qty'] . ']';
							$main_dropdown_data[$ii]['option_value'] = $row1['tag'];
							//$active .= '<option value="' . $row1['tag'] . '" style="color:#000;">' . $subjectname . ' ['.$row1['qty'].']</option>';
						}

						$ii++;
					}
					//print_r($main_dropdown_data);exit;
					$status = true;
					$response = $main_dropdown_data;
				} elseif ($engine_type == "normal") {

					$subresults = "SELECT TO_DAYS(eDate) - TO_DAYS(CURDATE()) as xx,examName,examId,memId,sDate,eDate FROM  subscribetbl WHERE memId='" . $mem_id . "' and examId not like '%E'  and examId not like '%M' order by examId ASC";
					$subresults_1 = mysqli_query($con, $subresults);
					$active = '';
					$free = '';
					$ii = 0;

					$main_dropdown_data = [];
					$main_dropdown_data[0][0]['option'] = "Orientation";
					$main_dropdown_data[0][0]['option_value'] = "[FAQ]";
					$main_dropdown_data[0][1]['option'] = "Bookmarked Questions";
					$main_dropdown_data[0][1]['option_value'] = "[BQ]";
					$ii++;


					while ($row = mysqli_fetch_array($subresults_1)) {

						$active_sids[$ii] = "'" . $row['examId'] . "'";
						$sid = $row['examId'];

						$exid_string_3 = substr((string) $sid, 0, 3);


						$exid_string = substr((string) $sid, 0, 3) . "C";

						$pos = strpos((string) $sid, "C");
						$pos_basic = strpos((string) $sid, "B");
						$pos_success = strpos((string) $sid, "S");
						$pos_elite = strpos((string) $sid, "L");
						$pos_vip = strpos((string) $sid, "V");
						$pos_gold = strpos((string) $sid, "G");
						$pos_diamond = strpos((string) $sid, "D");

						if ($row['xx'] >= 0 && ($pos !== false || $pos_basic !== false || $pos_success !== false || $pos_elite !== false || $pos_vip !== false || $pos_gold !== false || $pos_diamond !== false)) {
							$mysqlfull = "select * from subjects where id >= 0 and excl != 1 and id like '%" . $exid_string_3 . "%' and id not like '%E%' and id not like '%M%' order by id";
							$mysqlfull_1 = mysqli_query($con, $mysqlfull);
							$t = 0;
							// while ($row_full = mysqli_fetch_array($mysqlfull_1)) {
							// 	$subjectname = $row_full['shortname'];
							// 	$active .= '<option value="' . $row_full['id'] . '" style="color:#000;">' . $subjectname . '</option>';
							// }

							while ($row_full = mysqli_fetch_array($mysqlfull_1)) {
								$subjectname = $row_full['shortname'];
								$main_dropdown_data[$ii][$t]['option'] = $subjectname;
								$main_dropdown_data[$ii][$t]['option_value'] = $row_full['id'];
								$t++;
								//$active .= '<option value="' . $row_full['tag'] . '" style="color:#000;">' . $subjectname . ' ['.$row_full['qty'].']</option>';
							}
							//print_r($dropdown_array);exit;

						} else if ($row['xx'] >= 0 && ($pos === false && $pos_basic === false && $pos_success === false && $pos_elite === false && $pos_vip === false && $pos_gold === false && $pos_diamond === false)) {

							$mysql = "select * from subjects where id >= 0 and excl != 1 and id ='" . $sid . "' order by id";
							$msql_1 = mysqli_query($con, $mysql);
							$row1 = mysqli_fetch_array($msql_1);

							// $subjectname = $row1['shortname'];
							// $active .= '<option value="' . $sid . '" style="color:#000;">' . $subjectname . '</option>';

							$main_dropdown_data[$ii]['option'] = $subjectname;
							$main_dropdown_data[$ii]['option_value'] = $sid;
						}

						/* $mysql = "select * from subjects where id >= 0 and excl != 1 and id='".$sid."' and id NOT LIKE '%E' order by id";
                      $msql_1 = mysqli_query($con, $mysql);
                      $row1 = mysqli_fetch_array($msql_1);
                      $subjectname=$row1['shortname'];

                      if($row['xx'] > 0)
                      {
                      $active .= '<option value="'.$sid.'">'.$subjectname.'</option>';
                      } */
						$ii++;
					}


					if (isset($active_sids) && (is_countable($active_sids) ? count($active_sids) : 0) > 0) {
						// $active = '<option value="" disabled>--Active Sets--</option>' . $active;
						$active_id_string = implode(",", $active_sids);
						$mysql = "select * from subjects where id >= 0 and excl != 1 and id NOT LIKE '%E' and id NOT LIKE '%M' and  id NOT IN ($active_id_string) order by id";
					} else {
						$mysql = "select * from subjects where id >= 0 and excl != 1 and id NOT LIKE '%E' and id NOT LIKE '%M' order by id";
					}


					$mysql1 = mysqli_query($con, $mysql);
					$t = 0;
					while ($row1 = mysqli_fetch_array($mysql1)) {

						// $free .= '<option value="' . $row1['id'] . '">' . $row1['shortname'] . '</option>';

						$subjectname = $row1['shortname'];
						$main_dropdown_data[$ii][$t]['option'] = $subjectname;
						$main_dropdown_data[$ii][$t]['option_value'] = $row1['id'];
						$t++;
					}

					//print_r($main_dropdown_data);exit;
					$status = true;
					$response = $main_dropdown_data;
				} else {
					$status = true;
					$response = array("error" => "Please select engine type");;
				}
			} else {

				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}
		break;

	case 'question':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);

			// Print the POST array

			if (!empty($post_data)) {



				// ==== api paramiters =====
				$var1 = $post_data['lstSubject'];
				$var2 = $post_data['lstNum'];
				$var3 = $post_data['type'];
				$random = $post_data['chkRandom'];
				$userId = $post_data['userId'];
				$mode = "1";
				// // ========== get Exam id ===========
				// $tday = date("Y-m-d");
				// if (substr($var1, -1) == "]") {
				// 	$examidthreechar = substr(rtrim($var1, "]"), -3);
				// if ($examidthreechar == "04B") {
				// 	$examidthreechar = "04A";
				// }
				// } else {
				// 	$examidthreechar = substr($var1, 0, 3);
				// }
				// $query_subtbl = "SELECT * FROM subscribetbl where memId=" . $userId . " and examId like '" . $examidthreechar . "%' AND eDate >= CURDATE() order BY id DESC LIMIT 1";
				// $test_qry = mysqli_query($con, $query_subtbl);
				// $test = mysqli_fetch_array($test_qry);



				if (isset($post_data['radMode']) && $post_data['radMode'] == '1') {
					$mode = $post_data["radMode"];
				} elseif (isset($post_data['radMode']) && $post_data['radMode'] == '2') {
					$mode = $post_data["radMode"];
				}

				$hide = "0";

				if (isset($post_data['chkHide']) && $post_data['chkHide'] == '1') {
					$hide = $post_data["chkHide"];
				} // hide 0 = nothing , hide 1 = NOT IN ($h)

				// ==== api paramiters =====
				if ($var1 === "[BQ]") {
					$subject_id = $var1;
					$subject_name = 'Bookmarked Question';
					$test_engine = "b";
					$passing_percentage = $percent = "90";

					$ar = 1;

					// ============ engine_qlist.php ==================== //

					$table = 'question_usage';
					$nq = $var2;



					### $hide

					// if (isset($userId) && isset($hide) && $hide == '1') {
					// 	$hsql = "select distinct qids from $table where memid ='" . $userId . "' and subid like '" . substr((string) $subjectid, 1, 2) . "%' and ans='1'";
					// 	$hide_query = mysqli_query($con, $hsql);
					// 	$h = '';
					// 	while ($hide_hand = mysqli_fetch_array($hide_query)) {
					// 		$h .= "'" . $hide_hand['qids'] . "',";
					// 	}
					// 	$h =  rtrim($h, ',');
					// 	if ($h !== '') {
					// 		$hidesql2 = " and question_id NOT IN ($h) ";
					// 	} else {
					// 		$hidesql2 = ' ';
					// 	}
					// } else {
					// 	$hidesql2 = ' ';
					// }
					$hidesql2 = ' ';
					### $random

					if (isset($userId) && isset($random) && $random == '1') {
						$randomsql = ' rand() ';
					} else {
						$randomsql = ' bookmark_id DESC ';
					}


					//$sqlqry = "SELECT id FROM questions where " . $match2 . $var1 . "%' $hidesql2 order by $randomsql limit 0,$nq";

					//bookmark_questions
					$sqlqry = "SELECT question_id as id FROM bookmark_questions where user_id ='" . $userId . "' $hidesql2 order by $randomsql limit 0,$nq";

					$sqls = mysqli_query($con, $sqlqry);
					$i = 0;
					$res = [];
					while ($re = mysqli_fetch_array($sqls)) {
						$res[$i] = $re['id'];
						$i++;
					}


					$nq = $i;

					// if ($nq == 0) {
					// 	$status = true;
					// 	$response = "no question found!";
					// }


					$msg = "";

					$question_ids = array();




					for ($i = 0; $i < $nq; $i++) {
						$question_ids['qid' . $i] = $res[$i];
					}

					$question_count = $nq;




					// ============ cmfas_testengine_1.php ================== //
					$sqlqry_questions = "SELECT * FROM questions where id='" . $question_ids['qid0'] . "'";
					$firstQns = mysqli_query($con, $sqlqry_questions);
					$ques = mysqli_fetch_array($firstQns);


					// ============== speed_reference ==========
					$speed_reference_file_path = "";
					if (is_numeric($question_ids['qid0'])) {

					$query = "select subject_id,image from questions where id=" . $question_ids['qid0'];
					$results_qry = mysqli_query($con, $query);
					$phrase = mysqli_fetch_array($results_qry);
					include_once 'scrypt.php';
					$encrypted_time = scrypt(time());
					$speed_reference_file_path = "https://" . $_SERVER['SERVER_NAME'] . "/library/ebook.php?key=".$encrypted_time."&exid=" . substr((string) $phrase['subject_id'], 0, 3) . "&q=" . addslashes($phrase['image']);
					}
					// ============== end speed_reference ==========

					$flag_type = "ask_mentor";



					$status = true;

					$response = [
						"status" => true,
						"subject_name" => $subject_name,
						"question_ids" => $question_ids,
						"ques" => $ques,
						"speed_reference_file_path" => $speed_reference_file_path,
						"flag_type" => $flag_type,
						"question_count" => $question_count,
						"passing_percentage"=>$passing_percentage
					];
					// ======== End cmfas_testengine_1.php ==================== //




					// ============ End engine_qlist.php ==================== //



				} else {



					$query = "SELECT * FROM subjects where id like '" . trim($var1) . "%' limit 1";
					$results_qry = mysqli_query($con, $query);

					$test1 = mysqli_fetch_array($results_qry);
					$sid = $test1['id'];

					if (isset($userId)) {

						$tday = date("Y-m-d");
						if (substr($var1, -1) == "]") {
							$examidthreechar = substr(rtrim($var1, "]"), -3);
							if ($examidthreechar == "04B") {
								$examidthreechar = "04A";
							}
						} else {
							$examidthreechar = substr($var1, 0, 3);
						}
						$query_subtbl = "SELECT * FROM subscribetbl where memId=" . $userId . " and examId like '" . $examidthreechar . "%' AND eDate >= CURDATE() order BY id DESC LIMIT 1";
						$test_qry = mysqli_query($con, $query_subtbl);
						$test = mysqli_fetch_array($test_qry);


						if ($test['id'] != 0) {


							$testengine = "Yes";
							$startdateorig = $test['sDate'];
							$enddateorig = $test['eDate'];

							if ($startdateorig < "2030-01-01" && $startdateorig > '2006-01-01') {
								$validstart = "1";
							}
							if ($enddateorig < "2030-01-01" && $enddateorig > '2006-01-01') {
								$validend = "1";
							}


							if ($validstart !== "1" && $validend == "1") // invalid start date, valid end date. fix start date
							{

								switch (substr($test['examId'], -1)) {
									case "S":
										$new_start_date = date('Y-m-d', strtotime($enddateorig . "-2 month"));
										break;
									case "L":
										$new_start_date = date('Y-m-d', strtotime($enddateorig . "-3 month"));
										break;
									case "V":
										$new_start_date = date('Y-m-d', strtotime($enddateorig . "-4 month"));
										break;
									default:
										$new_start_date = date('Y-m-d', strtotime($enddateorig . "-1 month"));
										break;
								}
								mysqli_query($con, "UPDATE subscribetbl SET sDate='" . $new_start_date . "', eDate='" . $enddateorig . "' where id=" . $test['id']);
								$startdateorig = $new_start_date;
								$validstart = "1";
							}
							// update sdate or edate if required
							if ($validstart == "1") // if legit sdate, update edate if necessary
							{

								if ($validend == "1" && $tday > $startdateorig) {
								}  //if valid start + end and sdate has passed, no update required.
								elseif ($startdateorig < "2023-05-17") { // old unactivated packages



									if ($startdateorig >= $tday) {
										$xdate = $tday;
									} else {
										$xdate = $startdateorig;
									}

									switch (substr($test['examId'], -1)) {
										case "B":
											$new_end_date = date('Y-m-d', strtotime($xdate . "+1 month"));
											break;
										default:
											$new_end_date = date('Y-m-d', strtotime($xdate . "+2 month"));
									}
								} else { // update edate according to new plans


									if ($startdateorig >= $tday) {
										$xdate = $tday;
									} else {
										$xdate = $startdateorig;
									}

									switch (substr($test['examId'], -1)) {
										case "S":
											$new_end_date = date('Y-m-d', strtotime($xdate . "+2 month"));
											break;
										case "L":
											$new_end_date = date('Y-m-d', strtotime($xdate . "+3 month"));
											break;

										case "G":
											$new_end_date = date('Y-m-d', strtotime($xdate . "+3 month"));
											break;
										case "V":
											$new_end_date = date('Y-m-d', strtotime($xdate . "+4 month"));
											break;
										case "D":
											$new_end_date = date('Y-m-d', strtotime($xdate . "+4 month"));
											break;
										default:
											$new_end_date = date('Y-m-d', strtotime($xdate . "+1 month"));
									}
									mysqli_query($con, "UPDATE subscribetbl SET sDate='" . $xdate . "', eDate='" . $new_end_date . "' where id=" . $test['id']);
									$enddateorig = $new_end_date;
									$validend = "1";
								}
							}
							// if no change required for sdate and edate, give access rights if end date hasnt passed.
							if ($enddateorig >= $tday) {
								$accessrights = "OK";
							}
							if ($validstart !== "1" && $validend !== "1") {
								$accessrights = "NO";
							}
						} elseif ($var1 == '0010' || $var1 == '[FAQ]') {
							$accessrights = "OK";
						} else {
							$accessrights = "NO";
						}
					}


					if ($var3 == 'filter') {     ## filter affects subjects or subjects2 table, and subject_id like vs tag like
						$subtable = 'subjects2';
						$match  = 'tag like \'%';
						$match2 = 'tag like \'%';
					} else {
						$subtable = 'subjects';
						$match = 'id like \'';
						$match2 = 'subject_id like \'';
					}


					## Set Subject Names


					if ($var1 == '[FAQ]' || $var1 == '0010') { // orientation
						$subject_id = $var1;
						$subject_name = 'Orientation';
						$test_engine = "b";
						$passing_percentage = $percent = "90";
					} else {
						$qt = mysqli_query($con, "SELECT * FROM `$subtable` WHERE $match" . $var1 . "%'");
						$subjq = mysqli_fetch_array($qt);
						if (strlen($var1) == 3 || $var3 == "simulation") {
							$subject_name = $subjq['sub_group'] . " (Exam Simulation)";
						} elseif ($var1[0] == '-') {
							$subject_name = substr($subjq['shortname'], 0, strpos($subjq['shortname'], " ")) . ' (All)';
						} else {
							$subject_name = $subjq['shortname'];
						}

						$test_engine = $subjq['test_engine'];
						$passing_percentage = $percent = $subjq['passing_percentage'];
						$subject_id = $var1;
					}






					if ($accessrights == "OK") {
						$examId = $test['examId'];
						if ($test['sr'] == '1') {
							$sr = 'sr';
							$sr . $examidthreechar = 1;
						}
						$ar = 1;

						// if ($agree == "0" || $mnt == "1") {
						// 	// echo "<script>window.location.href='license.php'</script>";
						// 	// exit;

						// 	$status = true;
						// 	$response = "license";
						// }

						// echo "<script>location.href='engine_qlist.php?mode=" . $_SESSION['mode'] . "'</script>";
						// header('Location: https://' . $_SERVER['HTTP_HOST'] . '/engine_qlist.php?mode=' . $_SESSION['mode']);

						// ============ engine_qlist.php ==================== //

						$table = 'question_usage';
						$nq = $var2;



						### $hide

						if (isset($userId) && isset($hide) && $hide == '1') {
							$hsql = "select distinct qids from $table where memid ='" . $userId . "' and subid like '" . substr((string) $subjectid, 0, 3) . "%' and ans='1'";
							$hide_query = mysqli_query($con, $hsql);
							$h = '';
							while ($hide_hand = mysqli_fetch_array($hide_query)) {
								$h .= "'" . $hide_hand['qids'] . "',";
							}
							$h =  rtrim($h, ',');
							if ($h !== '') {
								$hidesql2 = " and id NOT IN ($h) ";
							} else {
								$hidesql2 = ' ';
							}
						} else {
							$hidesql2 = ' ';
						}

						### $random

						if (isset($userId) && isset($random) && $random == '1') {
							$randomsql = ' rand() ';
						} else {
							$randomsql = ' tag,explanation ASC ';
						}

						//if ($_SESSION['id'] == '31000') { // test load specific ids
						//	$sqlqry="SELECT id FROM questions2 where 1"; 
						//}
						//else {
						$sqlqry = "SELECT id FROM questions where " . $match2 . $var1 . "%' $hidesql2 order by $randomsql limit 0,$nq";
						//}



						$sqls = mysqli_query($con, $sqlqry);
						$i = 0;
						$res = [];
						while ($re = mysqli_fetch_array($sqls)) {
							$res[$i] = $re['id'];
							$i++;
						}


						$nq = $i;

						// if ($nq == 0) {
						// 	$status = true;
						// 	$response = "no question found!";
						// }


						$msg = "";

						$question_ids = array();




						for ($i = 0; $i < $nq; $i++) {
							$question_ids['qid' . $i] = $res[$i];
						}

						$question_count = $nq;




						// ============ cmfas_testengine_1.php ================== //
						$sqlqry_questions = "SELECT * FROM questions where id='" . $question_ids['qid0'] . "'";
						$firstQns = mysqli_query($con, $sqlqry_questions);
						$ques = mysqli_fetch_array($firstQns);


						// ============== speed_reference ==========
						$speed_reference_file_path = "";
						if (is_numeric($question_ids['qid0'])) {

							$query = "select subject_id,image from questions where id=" . $question_ids['qid0'];
							$results_qry = mysqli_query($con, $query);
							$phrase = mysqli_fetch_array($results_qry);
							include_once 'scrypt.php';
							$encrypted_time = scrypt(time());
							$speed_reference_file_path = "https://" . $_SERVER['SERVER_NAME'] . "/library/ebook.php?key=".$encrypted_time."&exid=" . substr((string) $phrase['subject_id'], 0, 3) . "&q=" . addslashes($phrase['image']);
						}
						// ============== end speed_reference ==========
						if ((str_ends_with((string) $examId, 'L')) || (str_ends_with((string) $examId, 'V'))) {
							$flag_type = "ask_mentor";
						} else {
							$flag_type = "report_error";
						}


						$status = true;

						$response = [
							"status" => true,
							"subject_name" => $subject_name,
							"question_ids" => $question_ids,
							"ques" => $ques,
							"speed_reference_file_path" => $speed_reference_file_path,
							"flag_type" => $flag_type,
							"question_count" => $question_count,
							"passing_percentage"=>$passing_percentage
						];
						// ======== End cmfas_testengine_1.php ==================== //




						// ============ End engine_qlist.php ==================== //

					} else {
						$ar = 0;
						$status = true;
						$response = array("error" => "NO VALID SUBSCRIPTION");
					}
				}



				// ============= api responce =============	//
				// $status = true;
				// $response = $accessrights;
			} else {

				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}

		break;

	case 'next_question':

		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);


			if (!empty($post_data)) {

				// $subid = $post_data['subid'];
				// $cur_qid = $post_data['cur_qid'];
				// $userid = $post_data['userid'];
				$next_qid = $post_data['next_qid'];

				// ===== next question fetch ====== ///
				$sqlqry_questions = "SELECT * FROM questions where id='" . $next_qid . "'";
				$firstQns = mysqli_query($con, $sqlqry_questions);
				$ques = mysqli_fetch_array($firstQns);


				// ============== speed_reference ==========
				$speed_reference_file_path = "";
				if (is_numeric($next_qid)) {
					$query = "select subject_id,image from questions where id=" . $next_qid;
					$results_qry = mysqli_query($con, $query);
					$phrase = mysqli_fetch_array($results_qry);
					include_once 'scrypt.php';
					$encrypted_time = scrypt(time());
					$speed_reference_file_path = "https://" . $_SERVER['SERVER_NAME'] . "/library/ebook.php?key=".$encrypted_time."&exid=" . substr((string) $phrase['subject_id'], 0, 3) . "&q=" . addslashes($phrase['image']);
				}
				// ============== end speed_reference ==========


				// ===== end next question fetch ====== ///

				$status = true;
				$response = [
					"status" => true,
					"ques" => $ques,
					"speed_reference_file_path" => $speed_reference_file_path
				];
			} else {
				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}

		break;


	case 'answer_submit':

		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);


			if (!empty($post_data)) {

				$subid = $post_data['subid'];
				if ($subid === "[BQ]") {

					$subid = "BQ";
				} else {
					if (str_ends_with((string) $subid, "]")) {
						$subid = substr(rtrim((string) $subid, "]"), -3);
						if ($subid == "04B") {
							$subid = "04A";
						}
					} else {
						$subid = $subid;
					}
				}


				$userid = $post_data['userId'];
				$ans_data = $post_data['ans_data'];


				$arr_len = count($ans_data);

				for ($i = 0; $i < $arr_len; $i++) {

					$cur_qid = $ans_data[$i]['qid'];
					$ans_status = $ans_data[$i]['status'];

					mysqli_query($con, "INSERT IGNORE INTO question_usage (`subid`, `qids`, `memid`,`ans`, `qdate`) VALUES ('$subid', '" . $cur_qid . "', '" . $userid . "','" . $ans_status . "', '" . date("Y-m-d") . "')");
				}






				$status = true;
				$response = [
					"status" => true,
					"msg" => "ans insert successfull",
				];
			} else {
				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}

		break;

	case 'speed_reference':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {

			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);


			if (!empty($post_data)) {

				$qid = $post_data['qid'];

				// ============== speed_reference ==========
				if (is_numeric($qid)) {

					$query = "select subject_id,image from questions where id=" . $qid;
					$results_qry = mysqli_query($con, $query);
					$phrase = mysqli_fetch_array($results_qry);
					include_once 'scrypt.php';
					$encrypted_time = scrypt(time());
					$full_path = "https://" . $_SERVER['SERVER_NAME'] . "/library/ebook.php?key=".$encrypted_time."&exid=" . substr((string) $phrase['subject_id'], 0, 3) . "&q=" . addslashes($phrase['image']);
	
					$status = true;
					$response = array("path" => $full_path);
				} else {
					$status = true;
					$response = array("error" => "qid not found");
				}
				// ============== end speed_reference ==========
			} else {
				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}


		break;


	case 'ebook_view':
		if ($_SERVER['REQUEST_METHOD'] == 'GET') {

			// $data = file_get_contents('php://input');
			// $post_data = json_decode($data, true);


			if ($_REQUEST['q'] == 'None') {

				echo "This question's answer or explanation is too straight-forward that it is not explained in the study guide.";
			} elseif (isset($_REQUEST['exid'])) {


				$exid = $_REQUEST['exid'];
				//include_once '../logerr.php';
				//if (isset($_SESSION['id'])) { logerr("ebook.log",",".$_SESSION['id'].",".$exid.' | phrase: '.$_GET['q']); }
				//else { logerr("ebook.log",",".$_SERVER['REMOTE_ADDR'].",".$exid.' | phrase: '.$_GET['q']); }

				$filename = 'library/guides/' . $exid . ".php";

				if (file_exists($filename)) {
					if (isset($_REQUEST['q'])) {
						$q = urldecode((string) $_REQUEST['q']);
						function getline($file, $find)
						{
							$y = null;
							$file_content = file_get_contents($file);
							$lines = explode("\n", $file_content);
							$y .= "\n" . $lines[0];
							$y .= "\n" . $lines[1];
							$y .= "\n" . $lines[2];

							/**	
							if (!isset($_POST['submit'])) { $y .= '<br><form action="#" method="post"><input type="hidden" name="exid" value="'.$_REQUEST['exid'].'"><input type="hidden" name="q" value="'.$_REQUEST['q'].'"> <input type="submit" name="submit" value=" Click here if a  uto-scroll did not happen after 5 secs "> </form>'; }
								else { $y .= "<br>A defect ticket has been raised for this question. If it still doesn't work, it'll be fixed soon. Sorry for the inconvenience caused."; }
							 **/
							$y .= "<button onclick='highlight()'>Doesn't autoscroll? Click me!</button><br>";
							$y .= '======= START OF TRUNCATED PORTION OF STUDY GUIDE =======<br><br>';
							foreach ($lines as $num => $line) {
								$pos = strpos(strip_tags($line), (string) $find);
								if ($pos !== false) {
									for ($x = -50; $x <= 150; $x++) {
										$z = $num + $x; // the line number to be fetched
										if ($z > 3) {
											$y .= "\n" . $lines[$z];
										}
									}
								}
							}
							$y .= "\n</div></div></td></td><br><br>======= END OF TRUNCATED PORTION OF STUDY GUIDE =======<br><br>SpeedRef™ serves to saves you time. Strictly for educational use only.<br><br><strong>Disclaimer: CMFAS Academy does not own the copyright to the study guide. All rights reserved to their respective owners.</strong>";
							$y .= "\n</body><script src='highlight3.js'></script><script type='text/javascript'>setTimeout(function() { highlight();}, 500);</script></html>";
							return $y;
						}

						$l = getline($filename, $q);
						$status = true;
						echo $l;
					} else {

						$html = file_get_contents($filename);
						//$html = str_ireplace('</body>','</BODY><script src="search-word4.js"></script>',$html);
						echo $html;
					}
				} else {
					$status = true;
					echo "Study Guide does not exist. E-mail support@cmfas.com.sg";
				}
			} else {

				$status = true;
				echo "Error. E-mail support@cmfas.com.sg";
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}


		break;



	case 'ask_mentor':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {

			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);


			if (!empty($post_data)) {

				$question_error = mysqli_query($con, "SELECT * from questions where id = " . $post_data['qid']);
				$question_error_array = mysqli_fetch_array($question_error);

				$question = $question_error_array['question'];
				$choice1 = $question_error_array['choice1'];
				$choice2 = $question_error_array['choice2'];
				$choice3 = $question_error_array['choice3'];
				$choice4 = $question_error_array['choice4'];
				$choice5 = $question_error_array['choice5'];
				$image = $question_error_array['image'];
				$explanation = $question_error_array['explanation'];
				$ans = $question_error_array['ans'];
				$reported_by = $post_data['txtemail'];

				$question_id = $post_data['qid'];
				$status = '0';
				$reason = $post_data['reason'];
				$subject = $post_data['sub'];
				$error_reported_date = date("Y-m-d");

				$selectQuery = "select * from questions_error where question_id= '" . $question_id . "' and reported_by = '" . $reported_by . "'";
				$selecthandle = mysqli_query($con, $selectQuery);
				$num_rows = mysqli_num_rows($selecthandle);

				if ($num_rows > 0) {
					// $resultString = "<br><br><b>You have reported this question before. Please do not re-submit.</b><br><br>";

					$status = true;
					$response = array("status" => true, "msg" => "You have reported this question before. Please do not re-submit.");
				} else {
					$updateQuestions = "insert into questions_error set `question_id` = '" . mysqli_real_escape_string($con, (string) $question_id) . "',
					`status` = '0',
					`subject_id` = '" . mysqli_real_escape_string($con, (string) $subject_error_array['subject_name']) . "',
					`question` = '" . mysqli_real_escape_string($con, (string) $question) . "',
					`choice1` = '" . mysqli_real_escape_string($con, (string) $choice1) . "',
					`choice2` = '" . mysqli_real_escape_string($con, (string) $choice2) . "',
					`choice3` = '" . mysqli_real_escape_string($con, (string) $choice3) . "',
					`choice4` = '" . mysqli_real_escape_string($con, (string) $choice4) . "',
					`choice5` = '" . mysqli_real_escape_string($con, (string) $choice5) . "',
					`ans` = '" . mysqli_real_escape_string($con, (string) $ans) . "',
					`explanation` = '" . mysqli_real_escape_string($con, (string) $explanation) . "',
						`image` = '" . mysqli_real_escape_string($con, (string) $image) . "',
					`subject` = '" . mysqli_real_escape_string($con, (string) $subject) . "',
					`reported_date` = '" . mysqli_real_escape_string($con, $error_reported_date) . "',
					`reported_by` = '" . mysqli_real_escape_string($con, (string) $reported_by) . "',
					`reason` = '" . mysqli_real_escape_string($con, (string) $post_data['reason']) . "' ,
					`uniquekey` = '" . mysqli_real_escape_string($con, (string) $question_id) . "#" . mysqli_real_escape_string($con, (string) $reported_by) . "'";

					mysqli_query($con, $updateQuestions);
					$mailsubject = "Ask a Mentor: Question ID : " . $post_data['qid'];
					$sendDetails_member = "<font face='tahoma' style='font-size:9px'><b>." . $mailsubject . "</b><br><br>";
					$sendDetails_member = "<font face='tahoma' style='font-size:9px'>Dear Member,<br><br>
					
					As a Gold plan subscriber, you can ask a mentor up to 10 questions.<br><br>

					We strive to respond to you within 3 business days.<br><br>
					<br><br>
					
					Good luck to your upcoming exam!<br><br>
					";

					if ($post_data['txtemail']) {
						supportemail($post_data['txtemail'], $mailsubject, $sendDetails_member);
					}


					if ($post_data['uid']) {
						$sendDetails .= "<b>Email: </b>" . $post_data['txtemail'] . "<br><br>";
					} else {
						$sendDetails .= "<b>Email: </b>" . $post_data['txtemail'] . "<br><br>";
					}

					$sendDetails .= "<b>e-Book version: </b>" . $post_data['txtEbook'] . "<br><br>";
					$sendDetails .= "<b>Subject: </b>" . $subject_error_array['subject_name'] . "<br><br>";
					$sendDetails .= "<b>Question ID: </b>" . $post_data['qid'] . "<br><br>";
					$sendDetails .= "<b>Question: </b>" . $question_error_array['question'] . "<br><br>";

					switch ($question_error_array['ans']) {
						case 'A':
							$choice = $question_error_array['choice1'];
							break;
						case 'B':
							$choice = $question_error_array['choice2'];
							break;
						case 'C':
							$choice = $question_error_array['choice3'];
							break;
						case 'D':
							$choice = $question_error_array['choice4'];
							break;
						case 'E':
							$choice = $question_error_array['choice5'];
							break;
					}

					$sendDetails .= "<b>Answer: </b>" . $question_error_array['ans'] . "<br><br>";
					if ($question_error_array['choice1']) $sendDetails .= "<b>Choice 1: </b>" . $question_error_array['choice1'] . "<br><br>";
					if ($question_error_array['choice2']) $sendDetails .= "<b>Choice 2: </b>" . $question_error_array['choice2'] . "<br><br>";
					if ($question_error_array['choice3']) $sendDetails .= "<b>Choice 3: </b>" . $question_error_array['choice3'] . "<br><br>";
					if ($question_error_array['choice4']) $sendDetails .= "<b>Choice 4: </b>" . $question_error_array['choice4'] . "<br><br>";
					if ($question_error_array['choice5']) $sendDetails .= "<b>Choice 5: </b>" . $question_error_array['choice5'] . "<br><br>";
					if ($question_error_array['explanation']) $sendDetails .= "<b>Explanation: </b>" . $question_error_array['explanation'] . "<br><br>";
					if ($question_error_array['image']) $sendDetails .= "<b>Image: </b>" . $question_error_array['image'] . "<br><br>";

					$sendDetails .= "<b>Question from Candidate: </b>" . $post_data['reason'] . "<br><br>";

					$mailSub1 = "CMFAS - Ask a Mentor - QID: " . $post_data['qid'];

					alert999($mailSub1, $sendDetails);

					// $resultString = "<br><br><b>Thank you. We'll get back to you within 3 business days.</b><br><br>";

					$status = true;
					$response = array("status" => true, "msg" => "Thank you. We'll get back to you within 3 business days.");
				}
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("status" => false, "error" => "Something went wrong");
		}


		break;
	case 'report_question':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {

			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);


			if (!empty($post_data)) {

				$question_error = mysqli_query($con, "SELECT * from questions where id = " . $post_data['qid']);
				$question_error_array = mysqli_fetch_array($question_error);

				$question = $question_error_array['question'];
				$choice1 = $question_error_array['choice1'];
				$choice2 = $question_error_array['choice2'];
				$choice3 = $question_error_array['choice3'];
				$choice4 = $question_error_array['choice4'];
				$choice5 = $question_error_array['choice5'];
				$image = $question_error_array['image'];
				$explanation = $question_error_array['explanation'];
				$ans = $question_error_array['ans'];
				$reported_by = $post_data['txtemail'];

				$question_id = $post_data['qid'];
				$status = '0';
				$reason = $post_data['reason'];
				$subject = $post_data['sub'];
				$error_reported_date = date("Y-m-d");

				$selectQuery = "select * from questions_error where question_id= '" . $question_id . "' and reported_by = '" . $reported_by . "'";
				$selecthandle = mysqli_query($con, $selectQuery);
				$num_rows = mysqli_num_rows($selecthandle);

				if ($num_rows > 0) {
					//$resultString = "<br><br><b>You have reported this question before. Please do not re-submit.</b><br><br>";

					$status = true;
					$response = array("status" => true, "msg" => "You have reported this question before. Please do not re-submit.");
				} else {
					$updateQuestions = "insert into questions_error set `question_id` = '" . mysqli_real_escape_string($con, (string) $question_id) . "',
						`status` = '0',
						`subject_id` = '" . mysqli_real_escape_string($con, (string) $subject_error_array['subject_name']) . "',
						`question` = '" . mysqli_real_escape_string($con, (string) $question) . "',
						`choice1` = '" . mysqli_real_escape_string($con, (string) $choice1) . "',
						`choice2` = '" . mysqli_real_escape_string($con, (string) $choice2) . "',
						`choice3` = '" . mysqli_real_escape_string($con, (string) $choice3) . "',
						`choice4` = '" . mysqli_real_escape_string($con, (string) $choice4) . "',
						`choice5` = '" . mysqli_real_escape_string($con, (string) $choice5) . "',
						`ans` = '" . mysqli_real_escape_string($con, (string) $ans) . "',
						`explanation` = '" . mysqli_real_escape_string($con, (string) $explanation) . "',
							`image` = '" . mysqli_real_escape_string($con, (string) $image) . "',
						`subject` = '" . mysqli_real_escape_string($con, (string) $subject) . "',
						`reported_date` = '" . mysqli_real_escape_string($con, $error_reported_date) . "',
						`reported_by` = '" . mysqli_real_escape_string($con, (string) $reported_by) . "',
						`reason` = '" . mysqli_real_escape_string($con, (string) $post_data['reason']) . "' ,
						`uniquekey` = '" . mysqli_real_escape_string($con, (string) $question_id) . "#" . mysqli_real_escape_string($con, (string) $reported_by) . "'";

					mysqli_query($con, $updateQuestions);
					$mailsubject = "Erroneous Question Report ID : " . $post_data['qid'];
					$sendDetails_member = "<font face='tahoma' style='font-size:9px'><b>." . $mailsubject . "</b><br><br>";
					$sendDetails_member = "<font face='tahoma' style='font-size:9px'>Dear Member,<br><br>
						
						Thank you for reporting this potential error to us.<br><br>
	
						We will review it within one week.<br><br>
					
						Do kindly seek clarifications from documents such as the official study guide issued by IBF or SCI College.<br><br>
						
						If you need help from an online mentor to explain and discuss certain topics, please sign up or upgrade to the Gold/Diamond package. :)<br><br>
						<br><br>
						
						Good luck to your upcoming exam!<br><br>
						";

					if ($post_data['txtemail']) {
						supportemail($post_data['txtemail'], $mailsubject, $sendDetails_member);
					}


					if ($post_data['uid']) {
						$sendDetails .= "<b>Email: </b>" . $post_data['txtemail'] . "<br><br>";
					} else {
						$sendDetails .= "<b>Email: </b>" . $post_data['txtemail'] . "<br><br>";
					}

					$sendDetails .= "<b>e-Book version: </b>" . $post_data['txtEbook'] . "<br><br>";
					$sendDetails .= "<b>Subject: </b>" . $subject_error_array['subject_name'] . "<br><br>";
					$sendDetails .= "<b>Question ID: </b>" . $post_data['qid'] . "<br><br>";
					$sendDetails .= "<b>Question: </b>" . $question_error_array['question'] . "<br><br>";

					switch ($question_error_array['ans']) {
						case 'A':
							$choice = $question_error_array['choice1'];
							break;
						case 'B':
							$choice = $question_error_array['choice2'];
							break;
						case 'C':
							$choice = $question_error_array['choice3'];
							break;
						case 'D':
							$choice = $question_error_array['choice4'];
							break;
						case 'E':
							$choice = $question_error_array['choice5'];
							break;
					}

					$sendDetails .= "<b>Answer: </b>" . $question_error_array['ans'] . "<br><br>";
					if ($question_error_array['choice1']) $sendDetails .= "<b>Choice 1: </b>" . $question_error_array['choice1'] . "<br><br>";
					if ($question_error_array['choice2']) $sendDetails .= "<b>Choice 2: </b>" . $question_error_array['choice2'] . "<br><br>";
					if ($question_error_array['choice3']) $sendDetails .= "<b>Choice 3: </b>" . $question_error_array['choice3'] . "<br><br>";
					if ($question_error_array['choice4']) $sendDetails .= "<b>Choice 4: </b>" . $question_error_array['choice4'] . "<br><br>";
					if ($question_error_array['choice5']) $sendDetails .= "<b>Choice 5: </b>" . $question_error_array['choice5'] . "<br><br>";
					if ($question_error_array['explanation']) $sendDetails .= "<b>Explanation: </b>" . $question_error_array['explanation'] . "<br><br>";
					if ($question_error_array['image']) $sendDetails .= "<b>Image: </b>" . $question_error_array['image'] . "<br><br>";

					$sendDetails .= "<b>Reason for Reporting: </b>" . $post_data['reason'] . "<br><br>";

					$mailSub1 = "CMFAS - Error Report ID : " . $post_data['qid'];

					alert999($mailSub1, $sendDetails);

					// $resultString = "<br><br><b>Thank you. We'll get back to you within 3 business days.</b><br><br>";

					$status = true;
					$response = array("status" => true, "msg" => "Thank you for reporting!");
				}
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("status" => false, "error" => "Something went wrong");
		}


		break;
	case 'add_bookmark':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {

			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);
			if (!empty($post_data)) {
				$subject_name = $post_data['subject_name'];
				$question_id = $post_data['question_id'];
				$user_id = $post_data['user_id'];
				$sqlqry = "SELECT * FROM bookmark_questions where user_id='" . $user_id . "' AND subject_name='" . $subject_name . "' AND question_id='" . $question_id . "'";
				$sqls = mysqli_query($con, $sqlqry);
				$row = mysqli_num_rows($sqls);
				if ($row) {

					$status = true;
					$response = array("status" => false, "error" => "Bookmark removed. Click 
					again to bookmark it again");
				} else {
					mysqli_query($con, "INSERT IGNORE INTO bookmark_questions (`question_id`, `subject_name`, `user_id`) VALUES ('" . $question_id . "', '" . $subject_name . "', '" . $user_id . "')");

					$status = true;
					$response = array("status" => true, "msg" => "Question Bookmarked");
				}
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("status" => false, "error" => "Something went wrong");
		}

		break;
	case 'remove_bookmark':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {

			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);
			if (!empty($post_data)) {


				$question_id = $post_data['question_id'];
				$user_id = $post_data['user_id'];
				mysqli_query($con, "DELETE FROM bookmark_questions WHERE question_id='" . $question_id . "' AND user_id='" . $user_id . "'");

				$status = true;
				$response = array("status" => true, "msg" => "Question deleted successfully");
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("status" => false, "error" => "Something went wrong");
		}

		break;

	case 'bookmark_list':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {

			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);
			if (!empty($post_data)) {
				$user_id = $post_data['user_id'];
				$sqlqry = "SELECT * FROM bookmark_questions where user_id='" . $user_id . "' order by question_id DESC";




				$sqls = mysqli_query($con, $sqlqry);
				$i = 0;
				$res = [];
				$subject_name = [];
				$numrow = mysqli_num_rows($sqls);
				if ($numrow) {
					while ($re = mysqli_fetch_array($sqls)) {
						$res[$i] = $re['question_id'];
						$subject_name[$i] = $re['subject_name'];
						$i++;
					}


					$nq = $i;



					$msg = "";

					$question_ids = array();




					for ($i = 0; $i < $nq; $i++) {
						$question_ids['qid' . $i] = $res[$i];
					}
					// ============ cmfas_testengine_1.php ================== //
					$sqlqry_questions = "SELECT * FROM questions where id='" . $question_ids['qid0'] . "'";
					$firstQns = mysqli_query($con, $sqlqry_questions);
					$ques = mysqli_fetch_array($firstQns);






					$status = true;
					$response = [
						"status" => true,
						"subject_name" => $subject_name[0],
						"question_ids" => $question_ids,
						"ques" => $ques,
						"question_count" => $nq

					];
				} else {

					$status = true;
					$response = [
						"status" => false,
						"msg" => "No data found"

					];
				}
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("status" => false, "error" => "Something went wrong");
		}

		break;
		case 'mobile_dropdown_data':
			if ($_SERVER['REQUEST_METHOD'] == 'GET') {
	
				// $data = file_get_contents('php://input');
				// $post_data = json_decode($data, true);
				// if (!empty($post_data)) {
					global $con; //connection is included
					$sql = "SELECT id,tag,shortname,qty,TR,sub_group FROM `subjects2` ORDER BY TR, id, shortname ASC;";
				
					$result = mysqli_query($con, $sql);
				
					if(!$sql){
						$status = true;
						$response = array("status" => false, "error" => "Something went wrong");
					}
				
					$data = [];
					$map = []; //[string]number keps track of the index of each subgroup as we retrieve query results
					$data_index_counter = -1;//keep track of $data array
					while ($row = mysqli_fetch_assoc($result)){
						$key = $row["sub_group"]; //the sub_group is the key for grouping all records from db
				
						#check if there's already an entry for a sub_group
						if(!isset($map[$key])){
							$map[$key] = ++$data_index_counter;
							$data[] = [
								"id" => $data_index_counter,
								"value"=> $key,
								"childs" => []
							];
						}
				
						//replace shortname with a lookahead and lookbehind assertion
						$shortName = preg_replace(["/.*[(]\s*(?=.+)/", "/(?=.+)\s*[)]\s*/"], "", $row["shortname"]);
						$id = $row["id"];
						$data[$map[$key]]["childs"][] = [
							"id"=> $row['tag'],
							"value"=> $shortName,
						];
					}
				
					
					$status = true;
					$response = [
						"status" => true,
						"dropdown_data" => $data
					];
					
				// } else {
				// 	$status = true;
				// 	$response = array("status" => false, "error" => "Invalid parameters");
				// }
			} else {
				$status = true;
				$response = array("status" => false, "error" => "Something went wrong");
			}
	
			break;
			case 'free_trial_dropdown_data':
				if ($_SERVER['REQUEST_METHOD'] == 'GET') {
		
					// $data = file_get_contents('php://input');
					// $post_data = json_decode($data, true);
					// if (!empty($post_data)) {
						global $con; //connection is included
						$sql = "SELECT id,tag,shortname,qty,TR,sub_group FROM `subjects2` ORDER BY TR, id, shortname ASC;";
					
						$result = mysqli_query($con, $sql);
					
						if(!$sql){
							$status = true;
							$response = array("status" => false, "error" => "Something went wrong");
						}
					
						$data = [];
						$map = []; //[string]number keps track of the index of each subgroup as we retrieve query results
						$data_index_counter = -1;//keep track of $data array
						
						$t = 0;
							

							while ($row_full = mysqli_fetch_array($result)) {
								$subjectname = $row_full['shortname'];
								$data[$t]['option'] = $subjectname;
								$data[$t]['option_value'] = $row_full['tag'];
								$t++;
								
							}
					
						
						$status = true;
						$response = [
							"status" => true,
							"dropdown_data" => $data
						];
						
					// } else {
					// 	$status = true;
					// 	$response = array("status" => false, "error" => "Invalid parameters");
					// }
				} else {
					$status = true;
					$response = array("status" => false, "error" => "Something went wrong");
				}
		
				break;
				case 'module_dropdown_data':
					if ($_SERVER['REQUEST_METHOD'] == 'GET') {
			
						// $data = file_get_contents('php://input');
						// $post_data = json_decode($data, true);
						// if (!empty($post_data)) {
							global $con; //connection is included
					$sql = "SELECT id,tag,shortname,qty,TR,sub_group FROM `subjects2` ORDER BY TR, id, shortname ASC;";
				
					$result = mysqli_query($con, $sql);
				
					if(!$sql){
						$status = true;
						$response = array("status" => false, "error" => "Something went wrong");
					}
				
					$data = [];
					$map = []; //[string]number keps track of the index of each subgroup as we retrieve query results
					$data_index_counter = -1;//keep track of $data array
					while ($row = mysqli_fetch_assoc($result)){
						$key = $row["sub_group"]; //the sub_group is the key for grouping all records from db
				
						#check if there's already an entry for a sub_group
						if(!isset($map[$key])){
							$map[$key] = ++$data_index_counter;
							$data[] = [
								"option_value" =>  $key,
								"option"=> $key,
								
							];
						}
				
						//replace shortname with a lookahead and lookbehind assertion
						
					}
				
					
					$status = true;
					$response = [
						"status" => true,
						"dropdown_data" => $data
					];
					
							
						
					} else {
						$status = true;
						$response = array("status" => false, "error" => "Something went wrong");
					}
			
					break;
					case 'chapter_dropdown_data_module':
						if ($_SERVER['REQUEST_METHOD'] == 'POST') {
				
							$data = file_get_contents('php://input');
							$post_data = json_decode($data, true);
							if (!empty($post_data)) {
								$module_id = $post_data['module_id'];
								global $con; //connection is included
								$sql = "SELECT id,tag,shortname,qty,TR,sub_group FROM `subjects2` WHERE sub_group='" . $module_id . "' ORDER BY TR, id, shortname ASC;";
							
								$result = mysqli_query($con, $sql);
							
								if(!$sql){
									$status = true;
									$response = array("status" => false, "error" => "Something went wrong");
								}
							
								$data = [];
								$map = []; //[string]number keps track of the index of each subgroup as we retrieve query results
								$data_index_counter = -1;//keep track of $data array
								
								$t = 0;
									
		
									while ($row_full = mysqli_fetch_array($result)) {
										$subjectname = $row_full['shortname'];
										$shortName = preg_replace(["/.*[(]\s*(?=.+)/", "/(?=.+)\s*[)]\s*/"], "", $row_full["shortname"]);
										$data[$t]['option'] = $shortName;
										$data[$t]['option_value'] = $row_full['tag'];
										$t++;
										
									}
							
								
								$status = true;
								$response = [
									"status" => true,
									"dropdown_data" => $data
								];
								
							} else {
								$status = true;
								$response = array("status" => false, "error" => "Invalid parameters");
							}
						} else {
							$status = true;
							$response = array("status" => false, "error" => "Something went wrong");
						}
				
						break;

	case 'DELETE':
		// HTTP DELETE method will delete the user
		list($status, $response) = $this->deleteUser();
		break;

	case 'copy_track':

		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);


			if (!empty($post_data)) {


				$mid = $post_data['user_id'];
				$copied = mysqli_real_escape_string($con, (string) $post_data['copied_text']);
				$email = $post_data['user_email'];

				$md5 = md5($mid . '-' . $copied);

				$query1 = "INSERT IGNORE INTO `copytrack` (`memid`, `copied`, `md5`) VALUES ('$mid', '$copied', '$md5')";
				mysqli_query($con, $query1);

				if (mysqli_insert_id($con) > 0) {
					$query2 = "UPDATE tmember set copy=copy+1 WHERE id='$mid'";
					mysqli_query($con, $query2);

					$query3 = "SELECT copy from tmember where id='$mid'";
					$aaa = mysqli_query($con, $query3);
					$cp = mysqli_fetch_array($aaa);
					$copy_count = $cp['copy'];


					if ($copy_count >= 100) {
						$query4 = "UPDATE subscribetbl set eDate=DATE_SUB(CURDATE(), INTERVAL 1 DAY) where memid='$mid' AND eDate >= CURDATE()";
						mysqli_query($con, $query4);
						include_once 'phpmailer/emailfunctions.php';
						alert999("A/C Suspended (Copy 100) : " . $mid, $mid);
						$query3 = "UPDATE tmember set loginsession='copytrack' WHERE id='$mid'";
						mysqli_query($con, $query3);
						$cmsg = "
							Dear Customer,
							<br><br>
							Our system has detected massive copying from your account and your account is being suspended automatically.
							<br><br>
							We have a strict policy against content copying. There had been customers who had done so previously for offline learning, but the content eventually leaked and being shared around.
							<br><br>
							In those cases, they became unwittingly responsible and liable for copyright infringement and the resulting damages.
							<br><br>
							We ask that you delete all materials or documents you may have created immediately and cease copying or taking screenshots/videos of our content.
							<br><br>
							After you have done so, you may reply to this email by undertaking to have deleted all copies and will take liability on any leak or copyright infringement that happens as a result. For example, you may reply in this format: <br><br><i>I, _____ (Full Name), have made sure all copies have been deleted and I undertake to be fully liable to the damages and losses caused to CMFAS Academy should there be any leak or copyright infringement caused by me. I hereby request my account and subscriptions to be reinstated.</i>
							<br><br>
							We will usually reinstate your account on the same day. Thank you.";
						supportemail($email, "Account Suspended due to Massive Copying", $cmsg, "kevin@kloge.com");



						$status = true;
						$response = [
							"status" => true,
							"msg" => "email send your email: " . $email
						];
					} else {

						$status = true;
						$response = [
							"status" => true,
							"msg" => "copy_count less"
						];
					}
				} else {

					$status = true;
					$response = [
						"status" => true,
						"msg" => "copytrack not insert"
					];
				}
			} else {
				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}

		break;

	case 'GET':
		// HTTP GET method will fetch the user details
		list($status, $response) = $this->getUser();
		break;


	case 'free_question':
		if ($_SERVER['REQUEST_METHOD'] == 'POST') {
			$data = file_get_contents('php://input');
			$post_data = json_decode($data, true);

			// Print the POST array

			if (!empty($post_data)) {



				// ==== api paramiters =====
				$var1 = $post_data['lstSubject'];
				$var2 = $post_data['lstNum'];
				$var3 = $post_data['type'];
				$random = $post_data['chkRandom'];
				$mode = "1";



				if (isset($post_data['radMode']) && $post_data['radMode'] == '1') {
					$mode = $post_data["radMode"];
				} elseif (isset($post_data['radMode']) && $post_data['radMode'] == '2') {
					$mode = $post_data["radMode"];
				}

				$hide = "0";

				if (isset($post_data['chkHide']) && $post_data['chkHide'] == '1') {
					$hide = $post_data["chkHide"];
				} // hide 0 = nothing , hide 1 = NOT IN ($h)

				// $status = true;
				// $response = array("status" => "cccccc");
				// break;


				// exit();

				// $run = true;

				do {

					$query = "SELECT * FROM subjects2 where tag like '" . trim($var1) . "%' limit 1";
					$results_qry = mysqli_query($con, $query);
					$subject = mysqli_fetch_array($results_qry);

					$sqlqry = "SELECT * FROM questions WHERE `tag` LIKE " . $subject['tag'] . " ORDER BY `id` DESC LIMIT 5";
					$results_qry = mysqli_query($con, $query);
					$questions = mysqli_fetch_array($results_qry);

					if (count($questions) > 0 && count($questions) == $var2) {
						$run = false;
						break;
					}
				} while ($run);

				// $query = "SELECT * FROM subjects2 ORDER BY RAND() LIMIT 1";
				// $results_qry = mysqli_query($con, $query);
				// $subject = mysqli_fetch_array($results_qry);

				// $status = true;
				// $response = array("error" => $subject);
				// break;





				if ($var3 == 'filter') {     ## filter affects subjects or subjects2 table, and subject_id like vs tag like
					$subtable = 'subjects2';
					$match  = 'tag like \'%';
					$match2 = 'tag like \'%';
				} else {
					$subtable = 'subjects';
					$match = 'id like \'';
					$match2 = 'subject_id like \'';
				}


				$passing_percentage = $percent = $subject['passing_percentage'];
				$subject_name = $subject['subject_name'];
				$var1 = $subject['tag'];

				### $hide

				$hidesql2 = ' ';

				### $random

				if (isset($random) && $random == '1') {
					$randomsql = ' rand() ';
				} else {
					$randomsql = ' tag,explanation ASC ';
				}

				$nq = $var2;

				$sqlqry = "SELECT id FROM questions where " . $match2 . $var1 . "%' $hidesql2 order by $randomsql limit 0,$nq";


				$sqls = mysqli_query($con, $sqlqry);
				$i = 0;
				$res = [];
				while ($re = mysqli_fetch_array($sqls)) {
					$res[$i] = $re['id'];
					$i++;
				}


				$nq = $i;


				$msg = "";

				$question_ids = array();




				for ($i = 0; $i < $nq; $i++) {
					$question_ids['qid' . $i] = $res[$i];
				}

				$question_count = $nq;




				// ============ cmfas_testengine_1.php ================== //
				$sqlqry_questions = "SELECT * FROM questions where id='" . $question_ids['qid0'] . "'";
				$firstQns = mysqli_query($con, $sqlqry_questions);
				$ques = mysqli_fetch_array($firstQns);


				// ============== speed_reference ==========
				$speed_reference_file_path = "";
				if (is_numeric($question_ids['qid0'])) {

					$query = "select subject_id,image from questions where id=" . $question_ids['qid0'];
					$results_qry = mysqli_query($con, $query);
					$phrase = mysqli_fetch_array($results_qry);
					include_once 'scrypt.php';
					$encrypted_time = scrypt(time());
					$speed_reference_file_path = "https://" . $_SERVER['SERVER_NAME'] . "/library/ebook.php?key=".$encrypted_time."&exid=" . substr((string) $phrase['subject_id'], 0, 3) . "&q=" . addslashes($phrase['image']);
				}



				$status = true;
				$response = [
					"status" => true,
					"subject_name" => $subject_name,
					"question_ids" => $question_ids,
					"ques" => $ques,
					"speed_reference_file_path" => $speed_reference_file_path,
					"flag_type" => "report_error",
					"question_count" => $question_count,
					"passing_percentage"=>$passing_percentage
				];
				break;
			} else {

				$status = true;
				$response = array("error" => "Invalid parameters");
			}
		} else {
			$status = true;
			$response = array("error" => "Something went wrong");
		}

		break;


	default:
		// Throw 'method not available' response for methods Other than PUT, POST, DELETE, GET
		http_response_code(405);
		return;
}
if ($status) {
	echo json_encode($response);
	// Success response
	http_response_code(200);
} else {
	// Based on the response, response codes can be changed.
	// For now always a Bad request error is thrown
	http_response_code(400);
}
