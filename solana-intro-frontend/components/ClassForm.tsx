import { FC, useEffect, useState } from "react";
import { StudentIntro } from "../models/StudentIntro";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

const ClassForm: FC = () => {
  const [studentIntro, setStudentIntro] = useState<StudentIntro>(
    new StudentIntro("", "")
  );
  const [studentIntros, setStudentIntros] = useState<Array<StudentIntro>>([]);

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  useEffect(() => {
    connection
      .getProgramAccounts(
        new PublicKey("HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf")
      )
      .then(async (accounts) => {
        const studentIntros: Array<StudentIntro> = accounts.map(
          ({ account }) =>
            StudentIntro.deserialize(account.data) as StudentIntro
        );

        setStudentIntros(studentIntros);
      });
  }, []);

  const handleSubmit = async () => {
    if (publicKey) {
      const buffer = StudentIntro.serialize(studentIntro);
      const transaction = new Transaction();

      const [pda] = PublicKey.findProgramAddressSync(
        [publicKey.toBuffer()],
        new PublicKey("HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf")
      );

      const instruction = new TransactionInstruction({
        keys: [
          {
            pubkey: publicKey,
            isWritable: false,
            isSigner: true,
          },
          {
            pubkey: pda,
            isWritable: true,
            isSigner: false,
          },
          {
            pubkey: SystemProgram.programId,
            isSigner: false,
            isWritable: true,
          },
        ],
        data: buffer,
        programId: new PublicKey(
          "HdE95RSVsdb315jfJtaykXhXY478h53X6okDupVfY9yf"
        ),
      });

      transaction.add(instruction);

      try {
        let txid = await sendTransaction(transaction, connection);
        console.log(
          `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
        );
      } catch (e) {
        alert(JSON.stringify(e));
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 15,
        width: 300,
        marginTop: 50,
      }}
    >
      <input
        type="text"
        placeholder="What do we call you?"
        value={studentIntro.name}
        onChange={(event) =>
          setStudentIntro(
            new StudentIntro(event.currentTarget.value, studentIntro.message)
          )
        }
      />
      <input
        type="text"
        placeholder="What brings you to solana friend?"
        value={studentIntro.message}
        onChange={(event) =>
          setStudentIntro(
            new StudentIntro(studentIntro.name, event.currentTarget.value)
          )
        }
      />
      <button disabled={!publicKey} onClick={handleSubmit}>
        Submit
      </button>

      <br />

      <h1>Found a total of {studentIntros.length} introductions on devnet</h1>
      <h1>Here are the first five</h1>

      <ul>
        {studentIntros.slice(0, 5).map((intro) => (
          <li>
            Name: {intro.name}, Message: {intro.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClassForm;
