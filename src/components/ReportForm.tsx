/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from '../lib/router';
import { auth, db, storage } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UserProfile, LocationData, AIAnalysis, IncidentStatus, PriorityLevel, Incident } from '../types';
import MapComponent from './MapComponent';
import { toast } from './Toast';
import { Upload, Navigation, MapPin, Sparkles, AlertCircle, HelpCircle, ArrowRight, ShieldCheck, Link2, Copy, CheckCircle2 } from 'lucide-react';

interface ReportFormProps {
  user: UserProfile | null;
}

export default function ReportForm({ user }: ReportFormProps) {
  const { navigate } = useRouter();

  // Form State
  const [description, setDescription] = useState('');
  const [landmark, setLandmark] = useState('');
  const [submittedCategory, setSubmittedCategory] = useState('OTHER');
  const [privacy, setPrivacy] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');

  // File Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Geolocation State
  const [coords, setCoords] = useState<LocationData>({
    latitude: 37.7749,
    longitude: -122.4194,
    displayAddress: '350 Oakwood Street, near School Main Gate',
    ward: 'Ward 4 - Education District'
  });
  const [locating, setLocating] = useState(false);

  // AI Triage State
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [runningAI, setRunningAI] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Duplicate Check State
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [attachingToIncidentId, setAttachingToIncidentId] = useState<string | null>(null);

  // Trigger duplicate check when coordinates, category, or description changes
  useEffect(() => {
    if (!description || description.trim().length < 15) {
      setDuplicates([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setCheckingDuplicates(true);
        const res = await fetch('/api/check-duplicates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            latitude: coords.latitude,
            longitude: coords.longitude,
            category: submittedCategory,
            description
          })
        });
        const data = await res.json();
        if (data.success && data.duplicates) {
          setDuplicates(data.duplicates);
        }
      } catch (err) {
        console.error('Error checking duplicates:', err);
      } finally {
        setCheckingDuplicates(false);
      }
    }, 1200);

    return () => clearTimeout(delayDebounceFn);
  }, [coords.latitude, coords.longitude, submittedCategory, description]);

  // Handle image drag & drop / selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB Limit
        toast('File size exceeds 10MB limit', 'error');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get current GPS location using standard browser Geolocation
  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      toast('Geolocation is not supported by your browser.', 'error');
      return;
    }

    setLocating(true);
    toast('Locating current GPS coordinates...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setCoords({
          latitude: lat,
          longitude: lng,
          displayAddress: `GPS Coordinates Area (${lat}, ${lng})`,
          ward: 'Veridale Sector'
        });
        setLocating(false);
        toast('GPS location locked successfully!', 'success');
      },
      (error) => {
        console.error('[CivicResolve Geolocation] error:', error);
        setLocating(false);
        toast(`Location lock failed: ${error.message}. Please use map pin picker instead.`, 'warning');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Call Server-side AI Triage
  const handleAITriage = async () => {
    if (!description || description.trim().length < 15) {
      toast('Please write a descriptive report of at least 15 characters first.', 'warning');
      return;
    }

    try {
      setRunningAI(true);
      toast('Calling CivicResolve AI Server for secure triage review...', 'info');

      const res = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, submittedCategory })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const ai = data.analysis;
        setAiAnalysis({
          categoryRecommendation: ai.category,
          confidenceScore: Math.round(ai.confidence * 100),
          urgencyLevel: ai.safetyRisk,
          safetyRiskScore: ai.severity * 20,
          recommendedDepartmentId: ai.suggestedDepartmentId === 'general_admin' ? 'general' : ai.suggestedDepartmentId,
          explanation: `${ai.summary} (Observed: ${ai.observedConditions.join(', ')})`,
          possibleDuplicateIds: []
        });
        // Pre-select the category returned by the server-side triage schema.
        setSubmittedCategory(ai.category);
        toast('AI Triage completed successfully!', 'success');
      } else {
        toast('AI Triage request failed: ' + data.error, 'error');
      }
    } catch (err: any) {
      console.error('[CivicResolve Triage] fetch error:', err);
      toast('AI Triage connection error: ' + err.message, 'error');
    } finally {
      setRunningAI(false);
    }
  };

  // Submit the report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast('You must be logged in to submit a report.', 'error');
      navigate('/login');
      return;
    }

    if (!description || description.trim().length < 15) {
      toast('Please write a descriptive report (at least 15 characters).', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      toast('Submitting report to Veridale City Council ledger...', 'info');

      // 1. Upload Photo to Firebase Storage (or use fallback Base64/placeholder)
      let mediaUrl = '';
      if (imageFile) {
        try {
          const storageRef = ref(storage, `reports/${Date.now()}_${imageFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, imageFile);
          
          await new Promise<void>((resolve, reject) => {
            uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(Math.round(progress));
              }, 
              (error) => {
                console.error('[CivicResolve Storage] upload failed:', error);
                reject(error);
              }, 
              () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  mediaUrl = downloadURL;
                  resolve();
                });
              }
            );
          });
        } catch (storageErr) {
          console.warn('[CivicResolve Storage] Storage bucket disabled or permissions error, falling back to local file preview...', storageErr);
          // Fallback to local Base64 string if Storage write fails (highly helpful for fast sandbox deployment)
          mediaUrl = imagePreview || mediaUrl;
        }
      }

      // 2. Perform AI Triage on submission
      let finalAIAnalysis: any = null;
      let calculatedPriority: any = null;

      try {
        const res = await fetch('/api/triage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description, submittedCategory, mediaUrls: mediaUrl ? [mediaUrl] : [], latitude: coords.latitude, longitude: coords.longitude })
        });
        const data = await res.json();
        if (data.success && data.analysis) {
          const ai = data.analysis;
          finalAIAnalysis = {
            categoryRecommendation: ai.category,
            confidenceScore: Math.round(ai.confidence * 100),
            urgencyLevel: ai.safetyRisk,
            safetyRiskScore: ai.severity * 20,
            recommendedDepartmentId: ai.suggestedDepartmentId === 'general_admin' ? 'general' : ai.suggestedDepartmentId,
            explanation: `${ai.summary} (Observed: ${ai.observedConditions.join(', ')})`,
            possibleDuplicateIds: []
          };
          calculatedPriority = data.deterministicPriority;
        }
      } catch (triageErr) {
        console.error('[CivicResolve Triage] auto triage failed:', triageErr);
      }

      // Default AI Triage fallback values if the service failed completely
      if (!finalAIAnalysis) {
        finalAIAnalysis = {
          categoryRecommendation: submittedCategory,
          confidenceScore: 70,
          urgencyLevel: 'MEDIUM',
          safetyRiskScore: 40,
          recommendedDepartmentId: submittedCategory === 'ELECTRICAL_HAZARD' || submittedCategory === 'BROKEN_STREETLIGHT' ? 'electrical' :
                                   submittedCategory === 'POTHOLE' || submittedCategory === 'ROAD_DAMAGE' ? 'roads' :
                                   submittedCategory === 'WATER_LEAKAGE' || submittedCategory === 'DAMAGED_PIPE' || submittedCategory === 'DRAINAGE_ISSUE' ? 'water' :
                                   submittedCategory === 'GARBAGE_OVERFLOW' || submittedCategory === 'ILLEGAL_DUMPING' ? 'sanitation' : 'general',
          explanation: 'Triage analyzed by secure fallback helper.',
          possibleDuplicateIds: []
        };
      }

      const reportId = 'rep-' + Math.random().toString(36).substring(2, 9);
      const batch = writeBatch(db);

      // Create Report Document
      const reportData = {
        id: reportId,
        incidentId: attachingToIncidentId || 'inc-' + Math.random().toString(36).substring(2, 9),
        reporterId: user.uid,
        description,
        mediaUrls: mediaUrl ? [mediaUrl] : [],
        location: {
          ...coords,
          ward: coords.ward || 'Veridale Sector'
        },
        submittedCategory,
        aiAnalysis: finalAIAnalysis,
        visibility: privacy,
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      batch.set(doc(db, 'reports', reportId), reportData);

      if (attachingToIncidentId) {
        // CASE A: CITIZEN CHOOSES TO ATTACH EVIDENCE TO AN EXISTING MASTER INCIDENT
        const masterRef = doc(db, 'incidents', attachingToIncidentId);
        const masterSnap = await getDoc(masterRef);
        
        if (masterSnap.exists()) {
          const masterData = masterSnap.data();
          const newReportCount = (masterData.reportCount || 1) + 1;
          
          // Increment report count on existing master incident
          batch.update(masterRef, {
            reportCount: newReportCount,
            updatedAt: new Date().toISOString()
          });

          // Add timeline event on existing master incident
          const eventId = 'evt-' + Math.random().toString(36).substring(2, 9);
          batch.set(doc(db, 'incidentEvents', eventId), {
            id: eventId,
            incidentId: attachingToIncidentId,
            eventType: 'CASE_MERGED_AS_DUPLICATE',
            actorId: user.uid,
            actorName: user.name,
            actorRole: user.role,
            message: `Citizen ${user.name} reported matching conditions and attached supporting evidence. Consolidating reports to ${newReportCount}.`,
            createdAt: new Date().toISOString()
          });

          // Create a linked duplicate incident that is instantly merged for indexing consistency
          const duplicateIncidentId = 'inc-' + Math.random().toString(36).substring(2, 9);
          const duplicateIncidentCode = 'CR-' + Math.floor(1000 + Math.random() * 9000);

          batch.set(doc(db, 'incidents', duplicateIncidentId), {
            id: duplicateIncidentId,
            incidentCode: duplicateIncidentCode,
            title: `Duplicate: ${submittedCategory.replace(/_/g, ' ')} at ${coords.displayAddress}`,
            category: submittedCategory,
            status: 'DUPLICATE_MERGED' as IncidentStatus,
            priorityScore: masterData.priorityScore || 40,
            priorityLevel: masterData.priorityLevel || 'MEDIUM',
            assignedDepartmentId: masterData.assignedDepartmentId || 'general',
            assignedDepartmentName: masterData.assignedDepartmentName || 'General Administration',
            assignedOfficerId: null,
            location: {
              ...coords,
              ward: coords.ward || 'Veridale Sector'
            },
            primaryImageUrl: mediaUrl,
            aiAnalysis: finalAIAnalysis,
            duplicateCandidateIds: [],
            reportCount: 1,
            confirmationCount: 0,
            isPublic: privacy === 'PUBLIC',
            containsSensitiveContent: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            resolvedAt: null,
            reopenedCount: 0,
            masterIncidentId: attachingToIncidentId
          });

          // Also create report event for the duplicate incident
          const dupEventId = 'evt-' + Math.random().toString(36).substring(2, 9);
          batch.set(doc(db, 'incidentEvents', dupEventId), {
            id: dupEventId,
            incidentId: duplicateIncidentId,
            eventType: 'REPORT_SUBMITTED',
            actorId: user.uid,
            actorName: user.name,
            actorRole: user.role,
            message: `Duplicate report ${duplicateIncidentCode} linked directly to active master ticket ${masterData.incidentCode}.`,
            createdAt: new Date().toISOString()
          });

          await batch.commit();
          toast(`Successfully attached your evidence to active issue ${masterData.incidentCode}!`, 'success');
        } else {
          throw new Error('Target master incident not found. Submitting as separate issue.');
        }

      } else {
        // CASE B: CREATE A NEW STANDALONE INCIDENT
        const incidentId = reportData.incidentId;
        const incidentCode = 'CR-' + Math.floor(1000 + Math.random() * 9000);

        const priorityScoreValue = calculatedPriority ? calculatedPriority.score : finalAIAnalysis.safetyRiskScore;
        const priorityLevelValue = calculatedPriority ? calculatedPriority.level : (finalAIAnalysis.urgencyLevel as PriorityLevel);

        const incidentData: Incident = {
          id: incidentId,
          incidentCode,
          title: `${submittedCategory.replace(/_/g, ' ')} at ${coords.displayAddress}`,
          category: submittedCategory,
          status: 'PENDING_ADMIN_REVIEW',
          priorityScore: priorityScoreValue,
          priorityLevel: priorityLevelValue,
          assignedDepartmentId: finalAIAnalysis.recommendedDepartmentId,
          assignedDepartmentName: finalAIAnalysis.recommendedDepartmentId === 'roads' ? 'Roads & Maintenance' :
                                 finalAIAnalysis.recommendedDepartmentId === 'electrical' ? 'Electrical Services' :
                                 finalAIAnalysis.recommendedDepartmentId === 'water' ? 'Water Services' :
                                 finalAIAnalysis.recommendedDepartmentId === 'sanitation' ? 'Sanitation Department' :
                                 'General Administration',
          assignedOfficerId: null,
          location: {
            ...coords,
            ward: coords.ward || 'Veridale Sector'
          },
          primaryImageUrl: mediaUrl,
          aiAnalysis: finalAIAnalysis,
          duplicateCandidateIds: [],
          reportCount: 1,
          confirmationCount: 0,
          isPublic: privacy === 'PUBLIC',
          containsSensitiveContent: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          resolvedAt: null,
          reopenedCount: 0,
          isPriorityManuallyAdjusted: false,
          priorityAdjustmentReason: null
        };

        const eventId = 'evt-' + Math.random().toString(36).substring(2, 9);
        const eventData = {
          id: eventId,
          incidentId: incidentId,
          eventType: 'REPORT_SUBMITTED',
          actorId: user.uid,
          actorName: user.name,
          actorRole: user.role,
          message: `Citizen report submitted: ${incidentCode}. Deterministic priority scoring: ${priorityLevelValue} (${priorityScoreValue}/100) based on category and environment.`,
          createdAt: new Date().toISOString()
        };

        batch.set(doc(db, 'incidents', incidentId), incidentData);
        batch.set(doc(db, 'incidentEvents', eventId), eventData);

        await batch.commit();
        toast(`Report ${incidentCode} submitted successfully to municipal ledger!`, 'success');
      }

      navigate('/my-reports');
    } catch (error: any) {
      console.error('[CivicResolve Report Submit] failed:', error);
      toast('Failed submitting report: ' + error.message, 'error');
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };


  return (
    <div id="report-issue-form" className="civic-page grid grid-cols-1 gap-6 lg:grid-cols-5">
      {/* Form Fields Column */}
      <form onSubmit={handleSubmit} className="civic-panel space-y-6 p-5 lg:col-span-3 sm:p-6">
        <div className="border-b border-slate-200 pb-5">
          <p className="civic-eyebrow">Citizen reporting</p>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-950">Submit a citizen report</h1>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            Provide issue details, evidence, and an exact location. AI suggests routing; a municipal administrator makes the final decision.
          </p>
        </div>

        {/* Drag and Drop Image Box */}
        <div className="space-y-2">
          <label htmlFor="image-upload-input" className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Evidence photo <span className="font-medium normal-case text-slate-500">(Optional)</span>
          </label>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              imagePreview ? 'border-[#5f87a2] bg-[#f2f7fa]' : 'border-slate-300 bg-slate-50 hover:border-[#5f87a2] hover:bg-[#f2f7fa]'
            }`}
            onClick={() => document.getElementById('image-upload-input')?.click()}
            role="button"
            tabIndex={0}
            aria-label={imagePreview ? 'Change selected evidence photo' : 'Choose an evidence photo'}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                document.getElementById('image-upload-input')?.click();
              }
            }}
          >
            <input
              id="image-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-48 rounded-xl object-contain mx-auto"
                />
                <p className="text-xs text-slate-500">
                  {imageFile ? imageFile.name : 'Image loaded successfully'} (Click to change)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">
                  Drag and drop your report photo here, or <span className="text-indigo-600">browse</span>
                </p>
                <p className="text-[10px] text-slate-400">Supports PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          {uploadProgress !== null && (
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100" role="progressbar" aria-label="Evidence upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={uploadProgress}>
              <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Issue Description
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="civic-control w-full p-3.5 text-xs leading-normal"
            placeholder="Please write details: e.g. An active water leakage gushing from Elm Street pavement, causing flooding in school perimeter..."
            aria-describedby="description-help"
          ></textarea>
          <p id="description-help" className="text-[11px] leading-4 text-slate-500">Include what is happening, who may be at risk, and nearby landmarks. Minimum 15 characters.</p>
        </div>

        {/* Location Landmark Field */}
        <div className="space-y-2">
          <label htmlFor="landmark" className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Landmark / Additional Location Info (Optional)
          </label>
          <input
            id="landmark"
            type="text"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="civic-control w-full p-3 text-xs"
            placeholder="e.g. Next to Elm Street bus shelter, behind loading dock B"
          />
        </div>

        {/* Category Choice with Let AI Suggest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="submittedCategory" className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Issue Category
            </label>
            <select
              id="submittedCategory"
              value={submittedCategory}
              onChange={(e) => setSubmittedCategory(e.target.value)}
              className="civic-control w-full p-3 text-xs"
            >
              <option value="POTHOLE">Pothole</option>
              <option value="ROAD_DAMAGE">Road Damage</option>
              <option value="BROKEN_STREETLIGHT">Broken Streetlight</option>
              <option value="ELECTRICAL_HAZARD">Electrical Hazard</option>
              <option value="WATER_LEAKAGE">Water Leakage</option>
              <option value="DAMAGED_PIPE">Damaged Water Pipe</option>
              <option value="DRAINAGE_ISSUE">Drainage Issue</option>
              <option value="GARBAGE_OVERFLOW">Garbage Overflow</option>
              <option value="ILLEGAL_DUMPING">Illegal Dumping</option>
              <option value="WASTE_MANAGEMENT">General Waste Management</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={handleAITriage}
              disabled={runningAI || description.trim().length < 15}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-4 text-xs font-bold text-indigo-800 hover:bg-indigo-100 disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              {runningAI ? 'Analyzing description...' : 'Let AI Suggest Triage'}
            </button>
          </div>
        </div>

        {/* Dynamic Duplicate Match Suggestions Panel */}
        {checkingDuplicates && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 animate-pulse">
            <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
            <span className="text-xs text-slate-500 font-medium">Checking Veridale registry for duplicate candidate reports...</span>
          </div>
        )}

        {!checkingDuplicates && duplicates.length > 0 && (
          <div className="p-4 bg-amber-50/75 border border-amber-200 rounded-xl space-y-3 animate-fade-in text-left">
            <div className="flex items-center gap-1.5 text-amber-800">
              <AlertCircle className="w-4.5 h-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wider">Possible Existing Matches Found ({duplicates.length})</h4>
            </div>
            <p className="text-[11px] text-amber-700 leading-normal">
              Other citizens have reported similar issues nearby. To prevent administrative congestion and speed up repairs, you can link your report and photo directly to an existing case:
            </p>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {duplicates.map((dup) => {
                const isSelected = attachingToIncidentId === dup.candidateId;
                return (
                  <div key={dup.candidateId} className={`p-3 bg-white border rounded-lg transition-all flex flex-col gap-1.5 text-left ${
                    isSelected ? 'border-indigo-600 ring-2 ring-indigo-50' : 'border-slate-100 hover:border-slate-200'
                  }`}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-mono font-bold text-slate-400">{dup.candidateCode}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        dup.matchType === 'STRONG' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {dup.matchType} Match ({dup.totalScore}%)
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-slate-800 leading-tight">{dup.title}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">"{dup.explanation}"</p>

                    <div className="flex justify-end pt-1">
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={() => setAttachingToIncidentId(null)}
                          className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-md"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected (Will link to this issue)
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setAttachingToIncidentId(dup.candidateId)}
                          className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[10px] rounded-md transition"
                        >
                          <Link2 className="w-3.5 h-3.5 text-slate-400" /> This is the same issue - attach to it
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {attachingToIncidentId && (
              <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-lg text-xs text-indigo-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>You have chosen to attach your report as a supportive witness. We will consolidate this into the master ticket.</span>
              </div>
            )}
          </div>
        )}

        {/* Privacy selection and Submit actions */}
        <div className="civic-action-bar grid grid-cols-1 items-center sm:grid-cols-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Visibility</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPrivacy('PUBLIC')}
                aria-pressed={privacy === 'PUBLIC'}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                  privacy === 'PUBLIC'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                Public Map
              </button>
              <button
                type="button"
                onClick={() => setPrivacy('PRIVATE')}
                aria-pressed={privacy === 'PRIVATE'}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border ${
                  privacy === 'PRIVATE'
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:text-slate-800'
                }`}
              >
                Private/Admin-only
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="civic-primary-button ml-auto flex w-full items-center justify-center gap-1.5 px-6 text-xs font-extrabold sm:w-auto"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0"></span>
                Submitting Report...
              </>
            ) : (
              <>
                Submit Report <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Map Picker and AI Preview Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* GPS location and map block */}
        <section className="civic-panel space-y-4 p-5" aria-labelledby="location-selection-heading">
          <div className="flex items-center justify-between">
            <h2 id="location-selection-heading" className="text-sm font-extrabold text-slate-950">Location selection</h2>
            <button
              type="button"
              onClick={handleGPSLocation}
              disabled={locating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-200 transition-all"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-600" />
              {locating ? 'Locating...' : 'Get GPS Lock'}
            </button>
          </div>

          <MapComponent
            incidents={[]}
            pickerMode={true}
            selectedCoords={coords}
            onCoordsChange={(newCoords) => setCoords(newCoords)}
          />

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2.5">
            <MapPin className="w-4.5 h-4.5 text-indigo-600 mt-0.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">
                Assigned Address Location
              </p>
              <p className="text-xs font-bold text-slate-800 leading-tight mt-0.5">
                {coords.displayAddress}
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5 font-mono">
                Ward: {coords.ward || 'Veridale Sector'} | Lat: {coords.latitude} | Lng: {coords.longitude}
              </p>
            </div>
          </div>
        </section>

        {/* AI Triage Review Card */}
        {aiAnalysis ? (
          <section className="civic-ai-panel animate-fade-in space-y-3.5 p-5" aria-labelledby="ai-review-heading" aria-live="polite">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 shrink-0 text-indigo-600" />
              <h2 id="ai-review-heading" className="text-sm font-extrabold text-slate-950">AI recommendation</h2>
              <span className="civic-tabular ml-auto text-[10px] font-bold uppercase text-indigo-700">
                {aiAnalysis.confidenceScore}% Confidence
              </span>
            </div>

            <p className="text-[11px] font-semibold text-indigo-800">Recommendation only · administrator review required</p>

            <p className="rounded-lg border border-indigo-100 bg-white/70 p-3 text-xs leading-5 text-slate-700">
              "{aiAnalysis.explanation}"
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="rounded-lg border border-indigo-100 bg-white/70 p-2.5">
                <span className="civic-data-label block">Urgency level</span>
                <span className={`text-xs font-bold uppercase ${
                  aiAnalysis.urgencyLevel === 'CRITICAL' ? 'text-rose-400' :
                  aiAnalysis.urgencyLevel === 'HIGH' ? 'text-amber-400' :
                  'text-slate-700'
                }`}>
                  {aiAnalysis.urgencyLevel}
                </span>
              </div>
              <div className="rounded-lg border border-indigo-100 bg-white/70 p-2.5">
                <span className="civic-data-label block">Safety risk score</span>
                <span className="civic-tabular text-xs font-bold text-slate-800">{aiAnalysis.safetyRiskScore}/100</span>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-white/70 p-2.5">
              <ShieldCheck className="w-4 h-4 shrink-0 text-indigo-700" />
              <div className="min-w-0">
                <span className="civic-data-label block">Routing suggestion</span>
                <span className="text-[11px] font-bold text-slate-800">
                  {aiAnalysis.recommendedDepartmentId === 'roads' ? 'Roads & Maintenance (72h Target)' :
                   aiAnalysis.recommendedDepartmentId === 'electrical' ? 'Electrical Services (120h Target)' :
                   aiAnalysis.recommendedDepartmentId === 'water' ? 'Water Services (24h Target)' :
                   aiAnalysis.recommendedDepartmentId === 'sanitation' ? 'Sanitation Department (48h Target)' :
                   'General Administration (96h Target)'}
                </span>
              </div>
            </div>
          </section>
        ) : (
          <div className="civic-empty-state min-h-40 p-5">
            <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-2" />
            <h5 className="text-xs font-bold text-slate-700">Let AI Suggest Categorization</h5>
            <p className="text-[11px] text-slate-500 max-w-[280px] mx-auto mt-1 leading-normal">
              Type at least 15 characters of detail in the description box, then click 'Let AI Suggest Triage' to see smart category routing instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
