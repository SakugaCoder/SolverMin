(function(){
	console.log("Start");

	var method = "min";
	var model = "simple";
	var btnOptionMax = document.getElementById("option_max");
	var btnOptionMin = document.getElementById("option_min");
	var btnOptionT = document.getElementById("option_t");
	var btnOptionS = document.getElementById("option_s");

	var btnGo = document.getElementById("btnGo");
	var btnSolve = document.getElementById("btnSolve");

	var fieldRows = document.getElementById("rows");
	var fieldCols = document.getElementById("cols");

	var totalRows = 0;
	var totalCols = 0;

	let results;
	var carry = 0;

	var mainContent = document.getElementById("mainContent");

	var content = "";
	var mat_values = new Array(90);
	var org_mat_values = new Array(90);
	var gc = 0;
	var definedResult = false;

	var res = document.getElementById("results");
	var err = document.getElementById("errors");

	var res_val = 0;
	/*
	document.getElementById("rows").value = 3;
	document.getElementById("cols").value = 4;
	*/

	for(c = 0; c < mat_values.length; c++){
		mat_values[c] = new Array(90);
	}

	for(c = 0; c < org_mat_values.length; c++){
		org_mat_values[c] = new Array(90);
	}
	
	for(c = 0; c < mat_values.length; c++){
		for(i = 0; i < mat_values.length; i++){
			//mat_values[c][i] = {num:null,state:false,trockloads:0};
		}
	}

	var mat_dem = new Array(90);
	var mat_sup = new Array(90);

	for(c1 = 0; c1 < mat_dem.length; c1++){
		mat_dem[c1] = {pos:c1,status:true};
	}

	for(c2 = 0; c2 < mat_sup.length; c2++){
		mat_sup[c2] = {pos:c2,status:true};
	}

	console.log(mat_values);

	var transportMatrixIsFill = false;
	var last_supply_position;

	btnOptionT.addEventListener("click",function(){
		console.log("Btn transport pressed");
		model = "transport";
		btnOptionMax.disabled = true;

		this.style.background = "#6CA4E5";
		this.style.color = "#E8EAF3";
		this.style.border = "1px solid #6CA4E5";
		this.style.transition = "all 0.3s";
		btnOptionS.style.background = "#fff";
		btnOptionS.style.color = "#656988";
		btnOptionS.style.transition = "all 0.3s";
		btnOptionS.style.border = "1px solid #656988";

		method = "min";
		btnOptionMin.style.background = "#6CA4E5";
		btnOptionMin.style.color = "#E8EAF3"
		btnOptionMin.style.transition = "all 0.3s";
		btnOptionMin.style.border = "1px solid #6CA4E5";
		btnOptionMax.style.background = "#fff";
		btnOptionMax.style.color = "#656988"
		btnOptionMax.style.transition = "all 0.3s";
		btnOptionMax.style.border = "1px solid #656988";
	});

	btnOptionS.addEventListener("click",function(){
		console.log("Btn simple pressed");
		model = "simple";
		btnOptionMax.disabled = false;
		this.style.background = "#6CA4E5";
		this.style.color = "#E8EAF3";
		this.style.border = "1px solid #6CA4E5";
		this.style.transition = "all 0.3s";
		btnOptionT.style.background = "#fff";
		btnOptionT.style.color = "#656988";
		btnOptionT.style.transition = "all 0.3s";
		btnOptionT.style.border = "1px solid #656988";
	});

	btnOptionMax.addEventListener('click',function(){
		console.log("Btn max pressed");
		method = "max";
		this.style.background = "#6CA4E5";
		this.style.color = "#E8EAF3";
		this.style.border = "1px solid #6CA4E5";
		this.style.transition = "all 0.3s";
		btnOptionMin.style.background = "#fff";
		btnOptionMin.style.color = "#656988";
		btnOptionMin.style.transition = "all 0.3s";
		btnOptionMin.style.border = "1px solid #656988";
	});


	btnOptionMin.addEventListener('click',function(){
		console.log("Btn min pressed");
		method = "min";
		this.style.background = "#6CA4E5";
		this.style.color = "#E8EAF3"
		this.style.transition = "all 0.3s";
		this.style.border = "1px solid #6CA4E5";
		btnOptionMax.style.background = "#fff";
		btnOptionMax.style.color = "#656988"
		btnOptionMax.style.transition = "all 0.3s";
		btnOptionMax.style.border = "1px solid #656988";
	});

	btnGo.addEventListener('click',function(){
		console.log("Btn go pressed");
		gc = 0;
		res.style.display = "none";
		totalRows = fieldRows.value;
		totalCols = fieldCols.value;
		definedResult = false;
		//console.log("Total rows: "+totalRows);
		//console.log("Total cols: "+totalCols);
		//console.log("Method: "+method);
		//console.log("Model: "+model);


		if( (totalRows < 1 || totalRows > 20) || (totalCols < 1 || totalCols > 20) ){
			//console.log("Error fatal numero maximo de valores alcanzado");
			mainContent.innerHTML = "<p>Error fatal numero maximo de valores alcanzado</p>";
			err.style.display = "block";
			err.innerHTML = "<p style='text-algin:center;'>Fatal error the maximum value is 20!</p>";
		}

		else{
			err.style.display = "none";
			err.innerHTML = "";
			if(model == "simple"){
				content="";
				//console.log("Parametros correctos");
				//console.log("Metodo simple");
				results = new Array(totalRows);
				content += "<container><center>";
				for(i = 0; i < totalRows; i++){
					content += "<div class = 'r"+(i+1)+"'>"
					for(c = 0; c < totalCols; c++){
						content += "<input type='number' name='r"+(i+1)+"c"+(c+1)+"' id='r"+(i+1)+"c"+(c+1)+"'>"
					}
					content += "</div>";
				}
				content += "</center></container>";
				btnSolve.style.display = "block";
				//console.log(content);
				mainContent.innerHTML = content;
				mainContent.style.display = "block";
				mainContent.style.transition = "all 0.6s";
			}

			else{
				content="";
				//console.log("Parametros correctos");
				//console.log("Metodo transport");
				results = new Array(totalRows+1);
				content += "<container><center>";
				tc = Number(totalCols) + 2;
				tr = Number(totalRows) + 2;
				//console.log("Total cols: "+tc);
				//console.log("Total rows: "+tr);
				for(i = 0; i < tr; i++){
					content += "<div class = 'r"+(i+1)+"'>"
					for(c = 0; c < tc; c++){
						if(i == 0 || c == 0){
							content += "<input type='text' name='r"+(i+1)+"c"+(c+1)+"' id='r"+(i+1)+"c"+(c+1)+"' style='font-size:14px;''>";
						}
						else{
							content += "<input type='number' name='r"+(i+1)+"c"+(c+1)+"' id='r"+(i+1)+"c"+(c+1)+"' style='font-size:14px;''>";
						}
						//console.log("I:"+i+"	C:"+c);
						
					}
					content += "</div>";
				}
				content += "</center></container>";
				btnSolve.style.display = "block";
				//console.log(content);
				mainContent.innerHTML = content;
				mainContent.style.display = "block";
				mainContent.style.transition = "all 0.6s";

				for(c = 0; c < tr; c++){
					for(i = 0; i < tc; i++){
						var element_url = String("r"+(c+1)+"c"+(i+1));
						var element = document.getElementById(element_url);
						console.log(element_url);
						if(c == 0){
							//console.log("First row");
							element.disabled = true;
							if(i > 0 && i < tc-1){
								element.value = "D" + i;
								element.style.color = "#6CA4E5";
							}

							if(i == tc-1){
								element.value = "Sup";
								element.style.color = "#6CA4E5";
							}
						}


						if(c > 0 && c < tr-1 && i == 0){
							//console.log("Source column");
							element.value = "S" + c;
							element.style.color = "#6CA4E5";
							element.disabled = true;
						}

						if(c == tr-1 && i == 0){
							element.value = "Dem";
							element.style.color = "#6CA4E5";
							element.disabled = true;
						}
					}
				}

				/*
				var mat_test_values = 
				[
				5, 2, 4, 3, 22,
				4, 8, 1, 6,	15,
				4, 6, 7, 5,	8,
				7, 12, 17, 9, 0];
				
				var con = 0;
				console.log("Starting to fight");
				for(i = 2; i <= tr; i++){
					for(c = 2; c <= tc; c++){
						console.log("r"+(i+1)+"c"+(c+1));
						document.getElementById("r"+i+"c"+c).value = mat_test_values[con];
						con++;
					}
				}
				*/

				document.getElementById("r"+tr+"c"+tc).value = null;

				//console.log(mat_test_values);

				/*
				mat_values = new Array(tr-2);
				for(i = 0; i < tr-2; i++){
					mat_values[i] = new Array(tc-2);
				}*/
				
				//Fill the matrix whit all the values
			}
		}

	});

	btnSolve.addEventListener('click',function(){

		if(model == "simple"){
			//Verify that all the fields are full
			var fillsAreFull = true;
			for(r = 1; r <= totalRows; r++){
				for(c = 1; c <= totalCols; c++){
					if(document.getElementById("r"+r+"c"+c).value == ""){
						fillsAreFull = false;
						break;
					}
			
				}
			}

			if(fillsAreFull){
				if(gc == 0){
					err.innerHTML = "";
					err.style.display = "none";
					for(c1 = 0; c1 < totalRows; c1++){
						for(c2 = 0; c2 < totalCols; c2++){
							document.getElementById("r"+(c1+1)+"c"+(c2+1)).style.background = "#fff";
							document.getElementById("r"+(c1+1)+"c"+(c2+1)).style.color = "#000";
							console.log("Changing color...");
						}
					}
					
					c1 = 0, c2 = 0;
					for(r = 1; r <= totalRows; r++){
						for(c = 1; c <= totalCols; c++){
							org_mat_values[c1][c2] = document.getElementById("r"+r+"c"+c).value;
							c2++;
						}
						c2 = 0;
						c1++;
					}
						
					console.log("Original matrix:");
					console.log(org_mat_values);
					console.log("Btn solve pressed");
					console.log("Starting sovler...");
					results = new Array(totalRows);
					solveMatrix(totalRows,totalCols);
					gc++;
				}
	

			}

			else{
				console.log("There are missing values");
				err.innerHTML = "<p>Error!&nbsp;There are missing values</p>";
				err.style.display = "block";
			}
		
		}

		else{
			//Check the total supply and demand
			var allIsFull = true;
			for(r = 2; r <= tr; r++){
				for(c = 2; c <= tc; c++){
					console.log("r"+r+"c"+c);
					if(r == tr && c == tc){
						break;
					}
					else{
						if(document.getElementById("r"+r+"c"+c).value == ""){
							allIsFull = false;
							console.log("The value is null");
							break;
						}
					}
				}
			}

			var totalSupply = 0;
			var totalDemand = 0;
			//Check Supply
			
			for(r = 2; r < tr; r++){
				totalSupply += Number(document.getElementById("r"+r+"c"+tc).value);
			}

			for(c = 2; c < tc; c++){
				totalDemand += Number(document.getElementById("r"+tr+"c"+c).value);
			}

			console.log("Total supply are"+totalSupply);
			console.log("Total demand: "+totalDemand);
			if(totalDemand == totalSupply && allIsFull && definedResult == false){
				err.style.display = "none";
				err.innerHTML = "";
				while(definedResult == false){
					//Filling the matrix "mat_values" with all the current values from inputs
					if(gc == 0){
						var c1 = 0, c2 = 0;
						for(r = 1; r < tr-1; r++){
							for(c = 1; c < tc-1; c++){
								console.log("r"+r+"c"+c);
								mat_values[c1][c2] = {num:document.getElementById("r"+(r+1)+"c"+(c+1)).value,
								state:false,trockloads:0};
								c2++;
							}
							c2=0;
							c1++;
						}
						gc++;
						c1 = 0, c2 = 0;
						for(r = 1; r <= tr; r++){
							for(c = 1; c <= tc; c++){
								org_mat_values[c1][c2] = document.getElementById("r"+r+"c"+c).value;
								c2++;
							}
							c2 = 0;
							c1++;
						}

						console.log("Original matrix:");
						console.log(org_mat_values);

						for(c1 = 0; c1 < mat_dem.length; c1++){
							mat_dem[c1] = {pos:c1,status:true};
						}
					
						for(c2 = 0; c2 < mat_sup.length; c2++){
							mat_sup[c2] = {pos:c2,status:true};
						}
					
					}
					
					//Create matrix for cols and rows status respectively
	
					//Find the nothwest field
					var c1 = 0, c2 = 0,r = 2;
					var northwestNumberFinded = false;
					var number = {n:0,y:0,x:0};
					while(r < tr && northwestNumberFinded == false){
						if(mat_sup[c1].status == false){
							console.log("El suministro "+(r-1)+" esta vacio");
						}
						else{
							for(c = 2; c < tc; c++){
								console.log("r"+r+"c"+c);
								if(mat_dem[c2].status == false){
									console.log("La demanda "+(c-1)+" esta vacia");
								}
								else{
									console.log("Northwest value finded: ");
									number = {n:document.getElementById('r'+r+'c'+c).value,y:r,x:c};
									mat_values[c1][c2].state = true;
									console.log(number.n);
									northwestNumberFinded = true;
									break;
								}
								c2++;
							}
							c2 = 0;
						}
						c1++;
						r++;
						if(northwestNumberFinded){
							break;
						}
					}
	
					console.log("The northwest number is:"+number.n);
					//console.log("The row is: "+number.y);
					//console.log("The col is: "+number.x);
	
	
					document.getElementById("r"+(Number(number.y))+"c"+(Number(number.x))).style.background = "red";
					//mat_values[Number(number.y)][Number(number.x)].state = true;
					//console.log(mat_values);
		
					//Rest the demand from this destination to the correspinding supply
		
					console.log("The coord for the number finded are:\nx:"+number.x+"\ny:"+number.y);
					var demand = document.getElementById("r"+(tr)+"c"+(number.x)).value;
					var supply = document.getElementById("r"+(number.y)+"c"+(tc)).value;
					console.log("The demand for this point is: "+demand);
					console.log("The supply for this point is: "+supply);
		
					var truckloads = 0;
					var new_supply = 0;
					var new_damand = 0;
					/*
					if(carry > 0){
						console.log("Are you carring")
						if(  (Number(demand) - carry) > 0){
							truckloads = carry;
							new_demand = Number(demand) - carry;
							new_supply = 0;
							carry = 0;
							document.getElementById(last_supply_position).value = 0;
							console.log("The demand is biggern than carry: ");
						}
			
						else if( (Number(demand) - carry) == 0){
							truckloads = carry;
							new_demand = 0;
							new_supply = 0;
							document.getElementById(last_supply_position).value = 0;
							console.log("Demand min carry equals 0");
						}
			
						else if( (Number(demand) - carry) < 0){
							truckloads = demand;
							new_demand = 0;
							new_supply = supply;
							carry =  carry - Number(supply);
							document.getElementById(last_supply_position).value = (carry - Number(demand));
							console.log("Demand min carry under 0");
							console.log("You are carring: "+carry);
						}
					}*/
		
					//else if(carry == 0){
						//console.log("No carry");
						if(  (Number(demand) - Number(supply)) > 0){
							truckloads = supply;
							new_demand = Number(demand) - Number(supply);
							new_supply = 0;
							console.log("Demand min suply");
						}
			
						else if( (Number(demand) - Number(supply)) == 0){
							truckloads = supply;
							new_demand = 0;
							new_supply = 0;
							console.log("Demand min supply equals 0");
						}
			
						else if( (Number(demand) - Number(supply)) < 0){
							truckloads = demand;
							new_demand = 0;
							new_supply = Number(supply) - Number(demand);
							carry = Number(supply) - Number(demand);
							last_supply = supply;
							console.log("Demand min supply under 0 are you carring:"+carry);
							last_supply_position = "r"+(number.y)+"c"+(tr);
						}
					//}
	
					document.getElementById("r"+(tr)+"c"+(number.x)).value = new_demand;
					document.getElementById("r"+(number.y)+"c"+(tc)).value = new_supply;
					
					if(truckloads > 0){
						document.getElementById("r"+(number.y)+"c"+(number.x)).value = truckloads;
						document.getElementById("r"+(number.y)+"c"+(number.x)).style.background = "#6CA4E5";
						document.getElementById("r"+(number.y)+"c"+(number.x)).style.color = "#fff";
					}
		
					else{
						document.getElementById("r"+(number.y)+"c"+(number.x)).style.background = "#fff";
					}
		
					//Verify if we have a result
					definedResult = true;
		
					//Check the supply results
					for(i = 2; i <= tr  ; i++){
						console.log("Sup"+i+":"+Number(document.getElementById("r"+i+"c"+tc).value));
						if(Number(document.getElementById("r"+i+"c"+tc).value) != 0){
							definedResult = false;
						}
						else{
							mat_sup[i-2].status = false;
						}
					}
		
					for(i = 2; i <= tc  ; i++){
						console.log("Des"+i+":"+Number(document.getElementById("r"+tr+"c"+i).value));
						if(Number(document.getElementById("r"+tr+"c"+i).value) != 0){
							definedResult = false;
						}
						else{
							mat_dem[i-2].status = false;
						}
					}
					console.log("Acual status of the cols and rows:");
					
					console.log("Status Demand cells:");
					console.log(mat_dem);
					console.log("Status Supply cells:");
					console.log(mat_sup);
		
					if(definedResult){
						console.log("");
						console.log("All is ok you have gotten the result");
						console.log(mat_values);
						res_val = 0;
			
						c1 = 0; c2 = 0;
						for(r = 2; r < tr; r++){
							for(c = 2; c < tc; c++){
								if(document.getElementById("r"+r+"c"+c).style.background == "rgb(108, 164, 229)"){
									//console.log(mat_values[c1][c2].num);
									//console.log(document.getElementById("r"+r+"c"+c).value);
									res_val += (Number(mat_values[c1][c2].num) * Number(document.getElementById("r"+r+"c"+c).value));
								}
								c2++;
							}
							c2=0;
							c1++;
					
						}
						//console.log(res_val);
						console.log(mat_values);
						res.innerHTML = "<p>Result:</p><b>&nbsp;"+res_val+"</b>";
						res.style.display = "block";
						gc = 0;
						generatePDF();
						break;
					}
		
					else if(definedResult == false){
						console.log("We haven't find the result");
					}
				}


			}

			else{
				if(allIsFull == false){
					console.log("There are missing values");
					err.innerHTML = "<p>Error!&nbsp;There are missing values</p>";
					err.style.display = "block";
				}

				if(demand != supply){
					console.log("Demand and supply are not the same");
					err.innerHTML = "<p>Error!&nbsp;Demand and supply are not the same</p>";
					err.style.display = "block";
				}

				else if(totalDemand != totalSupply && allIsFull == false){
					console.log("Demand and supply are not the same");
					err.innerHTML = "<p>Error!&nbsp;Demand and supply are not the same and there are missing values</p>";
					err.style.display = "block";
				}
			}
		
		}
	});

	function solveMatrix(tr,tc){
		var actual_res;
		var col_res;
		res_val = 0;
		for(i = 0; i< totalRows; i++){
			actual_res = Number(document.getElementById("r"+(i+1)+"c1").value);
			col_res = 1;
			for(c = 1; c < totalCols; c++){
				console.log("Comparando: "+actual_res+" con "+document.getElementById("r"+(i+1)+"c"+(c+1)).value);

					if(method == "min"){
						if( actual_res > Number(document.getElementById("r"+(i+1)+"c"+(c+1)).value) ){
							actual_res = Number(document.getElementById("r"+(i+1)+"c"+(c+1)).value);
							col_res = c+1;
							console.log("Nuevo res: "+actual_res);
							console.log("Columna: "+col_res);
						}
					}

					else{
						if( actual_res < Number(document.getElementById("r"+(i+1)+"c"+(c+1)).value) ){
							actual_res = Number(document.getElementById("r"+(i+1)+"c"+(c+1)).value);
							col_res = c+1;
							console.log("Nuevo res: "+actual_res);
							console.log("Columna: "+col_res);
						}
					}
			}
			results[i] ={
				resultado: actual_res,
				position:"r"+(i+1)+"c"+col_res
			};
			res_val += results[i].resultado;
			console.log("Res final: "+actual_res);
			console.log("Columna final: "+col_res);
		}

		console.log(results);

		for(counter = 0; counter < totalRows; counter++){
			document.getElementById(results[counter].position).style.background = "#fff";
			document.getElementById(results[counter].position).style.color = "#000";
			console.log("Pintantdo elementos");
			for(con = 0; con < totalCols; con++){
				console.log("Comparando: "+Number(document.getElementById(results[counter].position).value)+" con "+ Number(document.getElementById("r"+(counter+1)+"c"+(con+1)).value));
				if(Number(document.getElementById(results[counter].position).value) == Number(document.getElementById("r"+(counter+1)+"c"+(con+1)).value)  ){
					document.getElementById("r"+(counter+1)+"c"+(con+1)).style.background = "#6CA4E5";
					document.getElementById("r"+(counter+1)+"c"+(con+1)).style.color = "#E8EAF3";
					document.getElementById("r"+(counter+1)+"c"+(con+1)).style.transition = "all 0.4s";
					console.log("Encontrado duplicado");
				}
				console.log("Buscando elementos repetidos");
			}
		}
		
		console.log(res_val);
		res.innerHTML = "<p>Result:</p><b>&nbsp;"+res_val+"</b>";
		res.style.display = "block";
		generatePDF();
		res_val = 0;
	}


	function generatePDF(){
		console.log("You are generating a pdf");

		var doc = new jsPDF();
		var date = new Date();
		var doc_date = date.getFullYear() +"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+"-"+date.getMinutes();
		console.log("Doc date: "+doc_date);
		doc.setFontSize(22);
		doc.setTextColor(21,24,48);

		doc.text('Report Generated:', 70, 20);
		var imgData = 'data:image/png;base64,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';
		doc.addImage(imgData, 'PNG', 85, 30, 35,35);

		doc.setFontSize(16);
		doc.setTextColor(0,0,0);
		doc.text('Model: ',10,85);
		doc.setTextColor(12,56,67);
		doc.text(""+model,32,85);
		doc.setTextColor(0);
		doc.text("Method: ",10,95);
		doc.setTextColor(12,56,67);
		doc.text(""+method,33,95);
		doc.setTextColor(12,56,67);	
		doc.text('Original values: ',10,110);
		console.log("Model: "+model);
		console.log("Method: "+method);
		
		startY = 125;
		startX = 10;

		if(model == "simple"){
			console.log("Generating pdf in simple mode");
			for(i = 0; i< totalRows; i++){
				//Pringing original matrix
				for(c = 0; c < totalCols; c++){
					doc.setTextColor(0,0,0);
					doc.text(""+org_mat_values[i][c],startX,startY);
					startX += 20;
					console.log(document.getElementById("r"+(i+1)+"c"+(c+1)).value);

				}
				startY += 20;
				startX = 10;
			}
			startY += 10;
			doc.setTextColor(12,56,67);
			doc.addPage();
			startY = 20;
			doc.text('Results: ',10,startY);
			startY += 15;
			for(i = 0; i< totalRows; i++){
				for(c = 0; c < totalCols; c++){
					if(document.getElementById("r"+(i+1)+"c"+(c+1)).style.background == "rgb(108, 164, 229)"){
						console.log("Correct result");
						doc.setTextColor(139, 92, 221);
						doc.text(""+document.getElementById("r"+(i+1)+"c"+(c+1)).value,startX,startY);
					}
					else{
						console.log("Normal result");
						doc.setTextColor(0, 0 ,0);
						doc.text(""+document.getElementById("r"+(i+1)+"c"+(c+1)).value,startX,startY);
					}
					startX += 20;
					console.log(document.getElementById("r"+(i+1)+"c"+(c+1)).value);

				}
				startY += 20;
				startX = 10;
			}
			console.log("Result:"+res_val);
			doc.setTextColor(0);
            doc.text("Result: ",10,startY+5);
            doc.setTextColor(12,56,67);
            doc.text(""+res_val,33,startY+5);


            doc.save('Report '+doc_date+'.pdf');
		}
		else{
			console.log("Generating pdf in the hardest mode");
			//
			doc.setTextColor(12,56,67);	
			doc.text('Original values: ',10,110);
			for(i = 0; i< tr; i++){
				//Pringing original matrix
				for(c = 0; c < tc; c++){
					doc.setTextColor(0,0,0);
					doc.text(""+org_mat_values[i][c],startX,startY);
					startX += 20;
					console.log(document.getElementById("r"+(i+1)+"c"+(c+1)).value);

				}
				startY += 20;
				startX = 10;
			}
			startY += 10;
			doc.setTextColor(12,56,67);
			doc.addPage();
			startY = 20;
			doc.text('Results: ',10,startY);
			startY += 15;
			//
			c1 = 0; c2 = 0;
			for(r = 1; r <= tr; r++){
				for(c = 1; c <= tc; c++){
					if(document.getElementById("r"+r+"c"+c).style.background == "rgb(108, 164, 229)"){
						console.log(document.getElementById("r"+r+"c"+c).value);
						doc.setTextColor(139, 92, 221);
                        doc.text(""+document.getElementById("r"+r+"c"+c).value,startX,startY);
					}
					else{
						doc.setTextColor(0, 0 ,0);
                        doc.text(""+document.getElementById("r"+r+"c"+c).value,startX,startY);
					}
					startX += 20;
					console.log(document.getElementById("r"+r+"c"+c).value);
				}
				startY += 20;
				startX = 10;
			
			}
			console.log("Result: "+res_val );
			doc.setTextColor(0);
            doc.text("Result: ",10,startY+5);
            doc.setTextColor(12,56,67);
			doc.text(""+res_val,33,startY+5);
			
			doc.save('Report '+doc_date+'.pdf');

		}
	}
}());