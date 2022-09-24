# Arrays
Every standard tag contains its own array counterpart (except for `bit`, `text` and `package`)

All arrays can store up to `2147483647` tags without malfunctions.

### Arrays
`0x0e`: `byte` array - <Image src="ByteArrayIcon"/><br/>
`0x0f`: `short` array - <Image src="ShortArrayIcon"/><br/>
`0x10`: `int` array - <Image src="IntArrayIcon"/><br/>
`0x11`: `long` array - <Image src="LongArrayIcon"/><br/>
`0x12`: `float` array - <Image src="FloatArrayIcon"/><br/>
`0x13`: `double` array - <Image src="DoubleArrayIcon"/><br/>
`0x15`: `ubyte` array - <Image src="UByteArrayIcon"/><br/>
`0x16`: `ushort` array - <Image src="UShortArrayIcon"/><br/>
`0x17`: `uint` array - <Image src="UIntArrayIcon"/><br/>
`0x18`: `ulong` array - <Image src="ULongArrayIcon"/><br/>

## How it's stored

```
    Bytes:
    <type> <name...> <0x00> <count...> <data...>

    count is an integer
```