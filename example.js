const arr=[1,2,3,4,5,5,5,5,5,2,3,3,3,51,1];

for(let i=0; i<arr.length; i++){
 if(arr[i] !== arr[i+1]){
   continue;
 }else {	
   	let times = 0
   	for(let j=i; j<arr.length;j++){
      if(arr[i] === arr[j]){
        times = times + 1;
      }
    }
   console.log(arr[i] + 'is' + times + 'times')
 }

}