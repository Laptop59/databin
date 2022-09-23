# Byte
A byte is a numeric small tag DataBin has. It has a id of `0x02`. It can store from `-128` to `127`.

<Image src="ByteIcon"/><br/>

<sub><sup><span style="color:#9b001f;">A byte</span></sup></sub>

It occupies a byte (as the name implies).
It also has an <Link href=".DataBin.Tags.Standard.UByte">unsigned</Link> version.

## How it's stored
```
Bytes:
<0x02> <name...> <0x00> <value>
```