# UByte
A ubyte is a unsigned numeric small tag DataBin has. It has a id of `0x09`. It can store from `0` to `255`.

<Image src="UByteIcon"/><br/>

<sub><sup><span style="color:#9b001f;">An unsigned byte</span></sup></sub>

It occupies a byte (as the name implies).
It also has a <Link href=".DataBin.Tags.Standard.Byte">signed</Link> version.

## How it's stored
```
Bytes:
<0x09> <name...> <0x00> <value>
```