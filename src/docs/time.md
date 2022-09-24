# Time
A time is a (technically unsigned numeric) tag DataBin has. It has a id of `0x14`. It can store from `00:00:00.00` (`0`) to `23:59:59.59` (`8639999`)

<Image src="TimeIcon"/><br/>

<sub><sup><span style="color:#222222;">A time</span></sup></sub>

It occupies 3 bytes in value.

## How it's stored
```
Bytes:
<0x14> <name...> <0x00> <sum...>

where sum =  H * 360000 + M * 6000 + S * 100 + CS

CS = centiseconds (1/100 seconds)
S = seconds
M = minutes
H = hours
```