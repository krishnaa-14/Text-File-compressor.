// Min heap Implementation
class minHeap {
    constructor() {
        this.array = [];
    }

    size() {
        return (this.array.length);
    }

    empty() {
        return (this.size() === 0);
    }

    push(value) {
        this.array.push(value);
        this.upHeapify();
    }

    upHeapify() {
        var currIndex = this.size() - 1;

        while(currIndex > 0) {
            var currElem = this.array[currIndex];
            var parIndex = Math.floor((currIndex - 1) / 2);
            var parElem = this.array[parIndex];

            if(parElem[0] < currElem[0]) {
                break;
            }

            else {
                this.array[parIndex] = currElem;
                this.array[currIndex] = parElem;
                currIndex = parIndex;
            }
        }
    }

    top() {
        return this.array[0];
    }

    pop() {
        if(this.empty() === false) {
            var lastIndex = this.size() - 1;
            this.array[0] = this.array[lastIndex];
            this.array.pop();
            this.downHeapify(0);
        }
    }

    downHeapify(index) {
        var left = 2 * index + 1;
        var right = 2 * index + 2;
        var smallest = index;
        var len = this.size();

        if(left < len && this.array[left][0] < this.array[smallest][0]) {
            smallest = left;
        }

        if(right < len && this.array[right][0] < this.array[smallest][0]) {
            smallest = right;
        }

        if(smallest != index) {
            var temp = this.array[smallest];
            this.array[smallest] = this.array[index];
            this.array[index] = temp;
            this.downHeapify(smallest);
        }
    }
}   

class HuffmanCoder {
	getCodes(node, curr_code) {
		if (typeof (node[1]) === "string") {
			this.codes[node[1]] = curr_code;
			return;
		}
		this.getCodes(node[1][0], curr_code + '0');
		this.getCodes(node[1][1], curr_code + '1');
	}
	make_string(node) {
		if (typeof (node[1]) === "string") {
			return "'" + node[1];
		}
		return '0' + this.make_string(node[1][0]) + '1' + this.make_string(node[1][1]);
	}
	make_tree(tree_string) {
		let node = [];
		if (tree_string[this.index] === "'") {
			this.index++;
			node.push(tree_string[this.index]);
			this.index++;
			return node;
		}
		this.index++;
		node.push(this.make_tree(tree_string));
		this.index++;
		node.push(this.make_tree(tree_string));
		return node;
	}
	encode(data) {
		this.heap = new minHeap();

		var mp = new Map();
		for (let i = 0; i < data.length; i++) {
			if (mp.has(data[i])) {
				let foo = mp.get(data[i]);
				mp.set(data[i], foo + 1);
			}
			else {
				mp.set(data[i], 1);
			}
		}
		if (mp.size === 0) {
			let final_string = "zer#";
			
			let output_message = "Compression complete and file will be downloaded automatically." + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
			return [final_string, output_message];
		}

		if (mp.size === 1) {
			let key, value;
			for (let [k, v] of mp) {
				key = k;
				value = v;
			}
			let final_string = "one" + '#' + key + '#' + value.toString();
			let output_message = "Compression complete and file will be downloaded automatically." + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
			return [final_string, output_message];
		}
		for (let [key, value] of mp) {
			this.heap.push([value, key]);
		}
		while (this.heap.size() >= 2) {
			let min_node1 = this.heap.top();
			this.heap.pop();
			let min_node2 = this.heap.top();
			this.heap.pop();
			this.heap.push([min_node1[0] + min_node2[0], [min_node1, min_node2]]);
		}
		var huffman_tree = this.heap.top();
		this.heap.pop();
		this.codes = {};
		this.getCodes(huffman_tree, "");

		/// convert data into coded data
		let binary_string = "";
		for (let i = 0; i < data.length; i++) {
			binary_string += this.codes[data[i]];
		}
		let padding_length = (8 - (binary_string.length % 8)) % 8;
		for (let i = 0; i < padding_length; i++) {
			binary_string += '0';
		}
		let encoded_data = "";
		for (let i = 0; i < binary_string.length;) {
			let curr_num = 0;
			for (let j = 0; j < 8; j++, i++) {
				curr_num *= 2;
				curr_num += binary_string[i] - '0';
			}
			encoded_data += String.fromCharCode(curr_num);
		}
		let tree_string = this.make_string(huffman_tree);
		let ts_length = tree_string.length;
		let final_string = ts_length.toString() + '#' + padding_length.toString() + '#' + tree_string + encoded_data;
		let output_message = "Compression complete and file will be downloaded automatically." + '\n' + "Compression Ratio : " + (data.length / final_string.length).toPrecision(6);
		return [final_string, output_message];
	}

	decode(data) {
		let k = 0;
		let temp = "";
		while (k < data.length && data[k] != '#') {
			temp += data[k];
			k++;
		}
		if (k == data.length){
			alert("Invalid File! Please submit a valid De-Compressed file");
			location.reload();
			return;
		}
		if (temp === "zer") {
			let decoded_data = "";
			let output_message = "De-Compression complete and file will be downloaded automatically.";
			return [decoded_data, output_message];
		}
		if (temp === "one") {
			data = data.slice(k + 1);
			k = 0;
			temp = "";
			while (data[k] != '#') {
				temp += data[k];
				k++;
			}
			let one_char = temp;
			data = data.slice(k + 1);
			let str_len = parseInt(data);
			let decoded_data = "";
			for (let i = 0; i < str_len; i++) {
				decoded_data += one_char;
			}
			let output_message = "De-Compression complete and file will be downloaded automatically.";
			return [decoded_data, output_message];

		}
		data = data.slice(k + 1);
		let ts_length = parseInt(temp);
		k = 0;
		temp = "";
		while (data[k] != '#') {
			temp += data[k];
			k++;
		}
		data = data.slice(k + 1);
		let padding_length = parseInt(temp);
		temp = "";
		for (k = 0; k < ts_length; k++) {
			temp += data[k];
		}
		data = data.slice(k);
		let tree_string = temp;
		temp = "";
		for (k = 0; k < data.length; k++) {
			temp += data[k];
		}
		let encoded_data = temp;
		this.index = 0;
		var huffman_tree = this.make_tree(tree_string);

		let binary_string = "";
		for (let i = 0; i < encoded_data.length; i++) {
			let curr_num = encoded_data.charCodeAt(i);
			let curr_binary = "";
			for (let j = 7; j >= 0; j--) {
				let foo = curr_num >> j;
				curr_binary = curr_binary + (foo & 1);
			}
			binary_string += curr_binary;
		}
		binary_string = binary_string.slice(0, -padding_length);
		let decoded_data = "";
		let node = huffman_tree;
		for (let i = 0; i < binary_string.length; i++) {
			if (binary_string[i] === '1') {
				node = node[1];
			}
			else {
				node = node[0];
			}

			if (typeof (node[0]) === "string") {
				decoded_data += node[0];
				node = huffman_tree;
			}
		}
		let output_message = "De-Compression complete and file will be downloaded automatically.";
		return [decoded_data, output_message];
	}
}

/* 

Min heap Check

this.heap = new minHeap();
heap.push([10, 1]);
heap.push([5, 1]);
heap.push([7, 1]);

while(!this.heap.empty()) {
    console.log(this.heap.top());
    this.heap.pop();
}

*/


window.onload = function () {
    submitButton = document.getElementById("submitButton");
    uploadPage = document.getElementById("uploadPage");
    compressPage = document.getElementById("compressPage");
    gotohome = document.getElementById("gotohome");
    uploadFile = document.getElementById("uploadFile");
    compressButton = document.getElementById("compress");
    decompressButton = document.getElementById("decompress");
    outputPage = document.getElementById("outputPage");
    hufCode = new HuffmanCoder();

    submitButton.onclick = function() {

        var file = uploadFile.files[0];
        if(file === undefined) {
            alert("Please Upload a File and Try again !!");
            return;
        }

        var splitwords = file.name.split('.');
        var extension = splitwords[splitwords.length - 1].toLowerCase();
        if(extension != "txt") {
            alert("Please Upload a valid .txt file and Try again !!");
            return;
        }


        document.getElementById("uploadPage").style.display = "none";
        document.getElementById("compressPage").style.display = "block";
        document.getElementById("gotohome").style.display = "block";
    }

    compressButton.onclick = function() {
        var file = uploadFile.files[0];
        if(file === undefined) {
            alert("Please Upload a file and Try again !!");
            return;
        }

        onclickChanges2("Compressing your file ...\n", "Compressed");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [encodedString, outputMsg] = hufCode.encode(text);
			myDownloadFile(file.name.split('.')[0] + "_compressed.txt", encodedString);
			ondownloadChanges(outputMsg);
		}
        fileReader.readAsText(file, "UTF-8");
        document.getElementById("compressPage").style.display = "none";
        document.getElementById("outputPage").style.display = "block";

    }

    decompressButton.onclick = function () {
		console.log("decode onclick");
		var uploadedFile = uploadFile.files[0];
		if (uploadedFile === undefined) {
			alert("No file uploaded.\nPlease upload a file and try again!");
			return;
		}
		onclickChanges2("De-compressing your file ...\n", "De-Compressed");
		var fileReader = new FileReader();
		fileReader.onload = function (fileLoadedEvent) {
			let text = fileLoadedEvent.target.result;
			let [decodedString, outputMsg] = hufCode.decode(text);
			myDownloadFile(uploadedFile.name.split('.')[0] + "_decompressed.txt", decodedString);
			ondownloadChanges(outputMsg);
		}
		fileReader.readAsText(uploadedFile, "UTF-8");
		document.getElementById("compressPage").style.display = "none";
		document.getElementById("outputPage").style.display = "block";
	}

}

function onclickChanges2(secMsg, word) {
	compressButton.disabled = true;
	decompressButton.disabled = true;
    outputPage.innerHTML = "";
	let msg2 = document.createElement("span");
	msg2.className = "text2";
	msg2.innerHTML = secMsg;
	outputPage.appendChild(msg2);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = word + " file will be downloaded automatically!";
	outputPage.appendChild(msg3);
}

function myDownloadFile(fileName, text) {
	let a = document.createElement('a');
	a.href = "data:application/octet-stream," + encodeURIComponent(text);
	a.download = fileName;
	a.click();
}

function ondownloadChanges(outputMsg) {
	outputPage.innerHTML = "";
	let img = document.createElement("img");
	img.src = "done.jfif";
	img.id = "doneImg";
	outputPage.appendChild(img);
	var br = document.createElement("br");
	outputPage.appendChild(br);
	let msg3 = document.createElement("span");
	msg3.className = "text2";
	msg3.innerHTML = outputMsg;
	outputPage.appendChild(msg3);
}