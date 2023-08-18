import * as borsh from "@project-serum/borsh";

export class StudentIntro {
  name: string;
  message: string;

  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }

  /**
   * BORSH Schema used for serialization/deserialization purposes
   */
  static studentIntroSchema = borsh.struct([
    borsh.u8("variant"),
    borsh.str("name"),
    borsh.str("message"),
  ]);

  /**
   * @description Serializes utf-8 data to be stored on chain using BORSH
   * @returns Buffer of utf-8 data
   */
  static serialize(studentIntro: StudentIntro) {
    const buffer = Buffer.alloc(1000);
    this.studentIntroSchema.encode({ ...studentIntro, variant: 0 }, buffer);

    return buffer.slice(0, this.studentIntroSchema.getSpan(buffer));
  }
  /**
   * @description Deserializes onchain data using BORSH
   * @param buffer
   * @returns StudentIntro object
   */
  static deserialize(buffer: Buffer) {
    if (!buffer) return null;

    try {
      const { name, message } = this.studentIntroSchema.decode(buffer);
      return new StudentIntro(name, message);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
