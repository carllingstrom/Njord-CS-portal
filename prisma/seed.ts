import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with new FAQs...')

  // Delete all existing articles
  await prisma.kBArticle.deleteMany({})
  console.log('Cleared existing articles')

  // Create new FAQs based on Atle 180 documentation
  const articles = [
    {
      title: 'Atle is not working, nothing happens when I press the buttons',
      category: 'feature-not-working',
      tags: JSON.stringify(['emergency stop', 'hand control', 'buttons', 'not responding']),
      symptoms: 'Nothing happens when pressing buttons on the hand control.',
      causes: 'Emergency stop activated, device charging, or hand control unplugged.',
      steps: `Troubleshooting #1.1: The emergency stop button is activated. Follow this procedure to deactivate and don't forget to press the black reset button on the control panel.

After the emergency stop has been reset, the error indication on the hand control will light up for a couple of seconds. It is possible to use Atle 180 while this is occurring.

Troubleshooting #1.2: Atle is currently charging. If the device is plugged in and charging it is not possible to operate it.

Troubleshooting #1.3: The hand control is unplugged. Make sure to plug in the hand control properly.`,
      videoUrl: null, // Video link placeholder
      videoEmbed: null,
      published: true,
      order: 1,
    },
    {
      title: 'Atle does not charge',
      category: 'performance-reliability',
      tags: JSON.stringify(['charging', 'battery', 'emergency stop', 'power']),
      symptoms: 'Atle 180 does not charge when connected to power.',
      causes: 'Emergency stop button is activated, preventing charging.',
      steps: `Troubleshooting #2.1: The emergency stop button is activated. If the emergency stop is activated, Atle cannot be charged. Follow this procedure to deactivate and don't forget to press the black reset button on the control panel.

After the emergency stop has been reset, the error indication on the hand control will light up for a couple of seconds. It is possible to use Atle 180 while this is occurring.`,
      videoUrl: null, // Video link placeholder
      videoEmbed: null,
      published: true,
      order: 2,
    },
    {
      title: 'The lines jump off from the transfer bar attachment',
      category: 'feature-not-working',
      tags: JSON.stringify(['lines', 'wires', 'attachment', 'transfer bar', 'sheet']),
      symptoms: 'Lines/wires jump off or detach from the transfer bar attachment during use.',
      causes: 'Sheet not properly positioned, too tight, or pulled incorrectly.',
      steps: `Troubleshooting / recommendation #3.1: Loosen up the sheet and make it straight and fold it over the edge. Fingers around the loop.

Troubleshooting / recommendation #3.2: Watch out to pull too heavy in the sheet by the feets. This can make the lines jump off.`,
      videoUrl: null, // Picture & Video link placeholder
      videoEmbed: null,
      published: true,
      order: 3,
    },
    {
      title: 'Different lengths of the lines for Atle 180',
      category: 'setup-installation',
      tags: JSON.stringify(['lines', 'wires', 'bobbins', 'length', 'winding']),
      symptoms: 'The lines/wires have different lengths, causing uneven operation.',
      causes: 'Lines/wires are wound up differently on the bobbins.',
      steps: `Troubleshooting #4.1: The lines/wires are wound up differently on the bobbins.

Open the cover to the bobbins and release the lines fully with the support of another team member. Pull the back in with the hand control with the cover lids open to see they are brought back with the same length.`,
      videoUrl: null, // Picture & Video link placeholder
      videoEmbed: null,
      published: true,
      order: 4,
    },
    {
      title: 'The transfer is seemingly slow, slower than usual',
      category: 'performance-reliability',
      tags: JSON.stringify(['slow', 'transfer', 'battery', 'performance']),
      symptoms: 'Patient transfer is slower than normal operation.',
      causes: 'Battery capacity low or heated battery.',
      steps: `Troubleshooting #5.1: Battery capacity low or heated battery.

Try again after a couple of minutes. If the transfer is still slow, contact your representative at Njord Medtech for a change of battery.`,
      videoUrl: null,
      videoEmbed: null,
      published: true,
      order: 5,
    },
    {
      title: 'How to use Atle 180 with a heavy patient and a soft mattress?',
      category: 'setup-installation',
      tags: JSON.stringify(['heavy patient', 'soft mattress', 'sliding boards', 'slide sheet', 'transfer']),
      symptoms: 'Difficulty transferring heavy patients on soft mattresses.',
      causes: 'Increased friction and weight require additional assistance.',
      steps: `Recommendation #6.1 - use of additional sliding boards:

Transfer to examination table. Make use of one extra several sliding boards positioned horizontally in the soft mattress by the patient hip.

Transfer back to bed. Make use of two more sliding boards positioned vertically together with the other two in the soft mattress.

Recommendation #6.2 - use of slide sheet:
Make use of slide sheets in this way to facilitate the transfer.`,
      videoUrl: null, // Video links placeholder
      videoEmbed: null,
      published: true,
      order: 6,
    },
    {
      title: 'How to facilitate a transfer to CT head',
      category: 'setup-installation',
      tags: JSON.stringify(['CT', 'transfer', 'slide sheet', 'examination table']),
      symptoms: 'Need guidance for transferring patients to CT scanner.',
      causes: 'Special positioning required for CT head scans.',
      steps: `Recommendation #7.1 - use of slide sheet on the CT table:
Position slide sheet on the CT table to facilitate patient transfer.

Recommendation #7.2 - use of slide sheet in connection with the boards:
Use slide sheets together with sliding boards for optimal transfer positioning.`,
      videoUrl: null, // Picture & Video link placeholders
      videoEmbed: null,
      published: true,
      order: 7,
    },
    {
      title: 'How to check and change the lines for Atle 180',
      category: 'maintenance',
      tags: JSON.stringify(['lines', 'wires', 'bobbins', 'replacement', 'contamination', 'maintenance']),
      symptoms: 'Need to check or replace lines/wires and bobbins.',
      causes: 'Contamination or visible damage to lines/wires.',
      steps: `The lines and bobbin should be replaced with a new one in case of contamination or if the line is visibly damaged.

Follow this procedure to check and change the bobbins and lines:
1. Press the emergency stop button and ensure all electrical power is cut off
2. Open the cover over the bobbins
3. Remove the old wire from the wire guide
4. Loosen the screw holding the bobbin
5. Remove the old bobbin from the pin
6. Take a new bobbin and attach it by pushing into the pin
7. Tighten the screw again
8. Put the wire back into the wire guide
9. Close the cover

NOTE: If the bobbin is placed incorrectly, it can fall off the pin and patient transfer cannot be performed.`,
      videoUrl: null, // Picture & Video link placeholder
      videoEmbed: null,
      published: true,
      order: 8,
    },
    {
      title: 'What should be the height position of CT, x-ray, and bed with the Atle 180 transfer?',
      category: 'setup-installation',
      tags: JSON.stringify(['height', 'positioning', 'CT', 'x-ray', 'bed', 'examination table']),
      symptoms: 'Uncertain about proper height positioning for transfers.',
      causes: 'Incorrect height can cause transfer difficulties or safety issues.',
      steps: `The bed and examination table should be positioned at the same height.

Atle 180 should be positioned so that the position of the lines are just above the mattress.

This ensures optimal transfer conditions and prevents issues with line tension or patient positioning.`,
      videoUrl: null, // Picture & Video link placeholder
      videoEmbed: null,
      published: true,
      order: 9,
    },
  ]

  for (const article of articles) {
    await prisma.kBArticle.create({ data: article })
  }

  console.log(`Created ${articles.length} new FAQ articles`)
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
