let params = getParams($argument)

;(async () => {

let traffic = (await httpAPI("/v1/traffic"))
let interface = traffic.interface

/* 获取所有网络界面 */
let allNet = [];
for (var key in interface){
   allNet.push(key)
    }

if(allNet.includes("lo0")==true){
del(allNet,"lo0")
}

let net;
let index;
if( $persistentStore.read("NETWORK")==null||allNet.includes($persistentStore.read("NETWORK"))==false){
	index = 0
	}else{
	net = $persistentStore.read("NETWORK")
	for(let i = 0;i < allNet.length; ++i) {
		if(net==allNet[i]){
		index=i
		}
	}
}

/* 手动执行时切换网络界面 */
if($trigger == "button"){
	if(allNet.length>1) index += 1
	if(index>=allNet.length) index = 0;
	$persistentStore.write(allNet[index],"NETWORK")
};

net = allNet[index]
let network = interface[net]

let outCurrentSpeed = speedTransform(network.outCurrentSpeed) //上传速度
let outMaxSpeed = speedTransform(network.outMaxSpeed) //最大上传速度
let download = bytesToSize(network.in) //下载流量
let upload = bytesToSize(network.out) //上传流量
let inMaxSpeed = speedTransform(network.inMaxSpeed) //最大下载速度
let inCurrentSpeed = speedTransform(network.inCurrentSpeed) //下载速度

/* 判断网络类型 */
let netType;
if(net=="en0") {
	netType = "𝐖𝐢-𝐅𝐢"
	}else{
	netType = "𝐂𝐞𝐥𝐥𝐮𝐥𝐚𝐫"
	}


  $done({
      title:"𝐒𝐭𝐚𝐭𝐬 - "+netType,
      content:`𝐔𝐬𝐚𝐠𝐞 ${upload} | ${download}\n`+
      `𝐂𝐮𝐫𝐫  ${outCurrentSpeed} | ${inCurrentSpeed}\n` +
      `𝐏𝐞𝐚𝐤  ${outMaxSpeed} | ${inMaxSpeed}`,
		icon: params.icon,
		  "icon-color":params.color
    });

})()

function bytesToSize(bytes) {
  if (bytes === 0) return "𝟎𝐁";
  let k = 1024;
  sizes = ["𝐁", "𝐊𝐁", "𝐌𝐁", "𝐆𝐁", "𝐓𝐁", "𝐏𝐁", "𝐄𝐁", "𝐙𝐁", "𝐘𝐁"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function speedTransform(bytes) {
  if (bytes === 0) return "𝟎𝐁/𝐬";
  let k = 1024;
  sizes = ["𝐁/𝐬", "𝐊𝐁/𝐬", "𝐌𝐁/𝐬", "𝐆𝐁/𝐬", "𝐓𝐁/𝐬", "𝐏𝐁/𝐬", "𝐄𝐁/𝐬", "𝐙𝐁/𝐬", "𝐘𝐁/𝐬"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}


function httpAPI(path = "", method = "GET", body = null) {
    return new Promise((resolve) => {
        $httpAPI(method, path, body, (result) => {
			
            resolve(result);
        });
    });
};


function getParams(param) {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function del(arr,num) {
			var l=arr.length;
		    for (var i = 0; i < l; i++) {
			  	if (arr[0]!==num) { 
			  		arr.push(arr[0]);
			  	}
			  	arr.shift(arr[0]);
		    }
		    return arr;
		}